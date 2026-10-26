"use client";

import { type DragEvent, useEffect, useState } from "react";

import type {
  OrganizationChart,
  OrganizationGroup,
  OrganizationPerson,
} from "@repo/db/organization";
import Button from "@repo/ui/components/button";
import Input from "@repo/ui/components/input";
import Spinner from "@repo/ui/components/spinner";
import { useToast } from "@repo/ui/components/toast";
import Icon from "@repo/ui/icon";
import cn from "@repo/ui/lib/cn";
import Text from "@repo/ui/text";

import AdminPageHeader from "@components/adminPageHeader";
import {
  adminPanelClass,
  adminTextErrorColor,
  adminTextLabelColor,
} from "@constants/adminUi";
import { readOrganization, saveOrganization } from "@lib/adminData";

/**
 * types
 */
type Dragging = { kind: "group"; id: string } | { kind: "person"; id: string };

type DropTarget =
  | { kind: "into"; groupId: string }
  | { kind: "before"; groupId: string }
  | { kind: "people"; groupId: string }
  | { kind: "person"; groupId: string; personId: string }
  | { kind: "root" };

type TreeActions = {
  chart: OrganizationChart;
  dragging: Dragging | null;
  overKey: string | null;
  isFolded: boolean;
  onDragStart: (event: DragEvent<HTMLElement>, item: Dragging) => void;
  onDragEnd: () => void;
  onDragOver: (event: DragEvent<HTMLElement>, target: DropTarget) => void;
  onDrop: (event: DragEvent<HTMLElement>, target: DropTarget) => void;
  onGroupChange: (groupId: string, name: string) => void;
  onGroupRemove: (groupId: string) => void;
  onPersonAdd: (groupId: string) => void;
  onPersonChange: (
    groupId: string,
    personId: string,
    patch: Partial<OrganizationPerson>,
  ) => void;
  onPersonRemove: (groupId: string, personId: string) => void;
};

type GroupListProps = {
  parentId: string | null;
  actions: TreeActions;
};

type GroupCardProps = {
  group: OrganizationGroup;
  actions: TreeActions;
};

type PersonRowProps = {
  group: OrganizationGroup;
  person: OrganizationPerson;
  actions: TreeActions;
};

type IsSelfOrDescendantParams = {
  groups: OrganizationGroup[];
  ancestorId: string;
  id: string;
};

type MoveGroupParams = {
  chart: OrganizationChart;
  id: string;
  parentId: string | null;
  beforeId: string | null;
};

type MovePersonParams = {
  chart: OrganizationChart;
  personId: string;
  groupId: string;
  beforeId: string | null;
};

/**
 * screen — 조직도. 그룹·인원을 끌어 놓아 웹사이트 조직도 구조를 짠다
 */
const OrganizationScreen = () => {
  // hooks
  const toast = useToast();
  // states
  const [chart, setChart] = useState<OrganizationChart | null>(null);
  const [savedJson, setSavedJson] = useState("");
  const [dragging, setDragging] = useState<Dragging | null>(null);
  const [overKey, setOverKey] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isFolded, setIsFolded] = useState(false);
  // variables
  const isDirty = Boolean(chart) && JSON.stringify(chart) !== savedJson;
  // functions
  const updateChart = (
    next: (current: OrganizationChart) => OrganizationChart,
  ) => {
    setChart(current => (current ? next(current) : current));
  };
  const updateGroup = (
    groupId: string,
    next: (group: OrganizationGroup) => OrganizationGroup,
  ) => {
    updateChart(current => ({
      groups: current.groups.map(group =>
        group.id === groupId ? next(group) : group,
      ),
    }));
  };
  const canDrop = (target: DropTarget) => {
    if (!dragging || !chart) {
      return false;
    }
    if (dragging.kind === "person") {
      return target.kind !== "before" && target.kind !== "root";
    }
    if (target.kind === "root") {
      return true;
    }
    if (target.kind !== "into" && target.kind !== "before") {
      return false;
    }
    return !isSelfOrDescendant({
      groups: chart.groups,
      ancestorId: dragging.id,
      id: target.groupId,
    });
  };
  // handlers
  const handleGroupAdd = () => {
    updateChart(current => ({
      groups: [
        ...current.groups,
        {
          id: crypto.randomUUID(),
          name: "새 그룹",
          parentId: null,
          people: [],
        },
      ],
    }));
  };
  const handleFoldToggle = () => {
    setIsFolded(current => !current);
  };
  const handleRevert = () => {
    setChart(JSON.parse(savedJson) as OrganizationChart);
    setError(null);
  };
  const handleSave = async () => {
    if (!chart) {
      return;
    }
    if (chart.groups.some(group => !group.name.trim())) {
      setError("그룹 이름을 모두 채워 주세요.");
      return;
    }
    setIsSaving(true);
    setError(null);
    try {
      await saveOrganization(chart);
      setSavedJson(JSON.stringify(chart));
      toast.show({
        text: "저장했어요. 웹사이트 조직도에 반영돼요.",
        variant: "success",
      });
    } catch (saveError) {
      setError(
        saveError instanceof Error ? saveError.message : "저장하지 못했어요.",
      );
    }
    setIsSaving(false);
  };
  const handleDragStart = (event: DragEvent<HTMLElement>, item: Dragging) => {
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", item.id);
    const preview = event.currentTarget.closest("[data-drag-preview]");
    if (preview) {
      event.dataTransfer.setDragImage(preview, 16, 16);
    }
    setDragging(item);
  };
  const handleDragEnd = () => {
    setDragging(null);
    setOverKey(null);
  };
  const handleDragClear = () => {
    setOverKey(null);
  };
  const handleDragOver = (
    event: DragEvent<HTMLElement>,
    target: DropTarget,
  ) => {
    if (!canDrop(target)) {
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    event.dataTransfer.dropEffect = "move";
    setOverKey(readTargetKey(target));
  };
  const handleDrop = (event: DragEvent<HTMLElement>, target: DropTarget) => {
    if (!dragging || !canDrop(target)) {
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    const item = dragging;
    updateChart(current => {
      if (item.kind === "person") {
        return movePerson({
          chart: current,
          personId: item.id,
          groupId: target.kind === "root" ? "" : target.groupId,
          beforeId: target.kind === "person" ? target.personId : null,
        });
      }
      if (target.kind === "root") {
        return moveGroup({
          chart: current,
          id: item.id,
          parentId: null,
          beforeId: null,
        });
      }
      if (target.kind === "before") {
        const before = current.groups.find(
          group => group.id === target.groupId,
        );
        return moveGroup({
          chart: current,
          id: item.id,
          parentId: before?.parentId ?? null,
          beforeId: target.groupId,
        });
      }
      return moveGroup({
        chart: current,
        id: item.id,
        parentId: target.groupId,
        beforeId: null,
      });
    });
    handleDragEnd();
  };
  const handleGroupChange = (groupId: string, name: string) => {
    updateGroup(groupId, group => ({ ...group, name }));
  };
  const handleGroupRemove = (groupId: string) => {
    updateChart(current => {
      const removed = current.groups.find(group => group.id === groupId);
      return {
        groups: current.groups
          .filter(group => group.id !== groupId)
          .map(group =>
            group.parentId === groupId
              ? { ...group, parentId: removed?.parentId ?? null }
              : group,
          ),
      };
    });
  };
  const handlePersonAdd = (groupId: string) => {
    setIsFolded(false);
    updateGroup(groupId, group => ({
      ...group,
      people: [
        ...group.people,
        { id: crypto.randomUUID(), title: "", name: "" },
      ],
    }));
  };
  const handlePersonChange = (
    groupId: string,
    personId: string,
    patch: Partial<OrganizationPerson>,
  ) => {
    updateGroup(groupId, group => ({
      ...group,
      people: group.people.map(person =>
        person.id === personId ? { ...person, ...patch } : person,
      ),
    }));
  };
  const handlePersonRemove = (groupId: string, personId: string) => {
    updateGroup(groupId, group => ({
      ...group,
      people: group.people.filter(person => person.id !== personId),
    }));
  };
  // effects
  useEffect(() => {
    let isCancelled = false;
    readOrganization()
      .then(result => {
        if (!isCancelled) {
          setChart(result);
          setSavedJson(JSON.stringify(result));
        }
      })
      .catch((loadError: unknown) => {
        if (!isCancelled) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "조직도를 불러오지 못했어요.",
          );
        }
      });
    return () => {
      isCancelled = true;
    };
  }, []);
  useEffect(() => {
    if (!isDirty) {
      return;
    }
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isDirty]);
  // render
  const actions: TreeActions | null = chart
    ? {
        chart,
        dragging,
        overKey,
        isFolded,
        onDragStart: handleDragStart,
        onDragEnd: handleDragEnd,
        onDragOver: handleDragOver,
        onDrop: handleDrop,
        onGroupChange: handleGroupChange,
        onGroupRemove: handleGroupRemove,
        onPersonAdd: handlePersonAdd,
        onPersonChange: handlePersonChange,
        onPersonRemove: handlePersonRemove,
      }
    : null;
  return (
    <div className="flex flex-col gap-5">
      <AdminPageHeader
        title="조직도 관리"
        description="웹사이트 재단소개 › 조직도에 보이는 구조입니다. 손잡이(⋮⋮)를 끌어 순서와 위아래를 바꾸고, 저장해야 반영돼요."
        actions={
          <>
            <Button
              variant="line"
              color="gray"
              size="small"
              text={isFolded ? "인원 펼치기" : "인원 닫기"}
              leftChildren={
                <Icon
                  name={isFolded ? "chevron-down" : "chevron-up"}
                  size={16}
                />
              }
              isDisabled={!chart}
              onClick={handleFoldToggle}
            />
            <Button
              variant="solid"
              color="primary"
              size="small"
              text="저장"
              isDisabled={!isDirty}
              isLoading={isSaving}
              onClick={handleSave}
            />
          </>
        }
      />
      <div className="flex flex-wrap items-center gap-2">
        <Button
          variant="line"
          color="black"
          size="small"
          text="그룹 추가"
          leftChildren={<Icon name="plus" size={16} />}
          isDisabled={!chart}
          onClick={handleGroupAdd}
        />
        {isDirty ? (
          <Button
            variant="ghost"
            color="gray"
            size="small"
            text="저장 전으로 되돌리기"
            onClick={handleRevert}
          />
        ) : null}
        <Text variant="caption-2" color={adminTextLabelColor}>
          그룹 머리를 다른 그룹 머리에 놓으면 그 아래로, 그룹 사이 빈칸에 놓으면
          그 자리로 갑니다. 인원은 다른 인원이나 그룹에 놓아요.
        </Text>
      </div>
      {error ? (
        <Text
          variant="caption-1"
          color={adminTextErrorColor}
          className="rounded-medium bg-red-50 px-3 py-2">
          {error}
        </Text>
      ) : null}
      <section
        className={cn(adminPanelClass, "p-4 md:p-6")}
        onDragOver={handleDragClear}>
        {actions ? (
          <div className="flex flex-col">
            {actions.chart.groups.length === 0 ? (
              <Text
                variant="body-3"
                color={adminTextLabelColor}
                className="py-10 text-center">
                그룹이 없어요. 그룹 추가로 시작하세요.
              </Text>
            ) : (
              <GroupList parentId={null} actions={actions} />
            )}
            {dragging?.kind === "group" ? (
              <div
                className={cn(
                  "mt-3 grid h-12 place-items-center rounded-large border border-dashed text-4 leading-5",
                  overKey === "root"
                    ? "border-primary-500 bg-primary-50 text-primary-600"
                    : "border-gray-300 text-gray-500",
                )}
                onDragOver={event => handleDragOver(event, { kind: "root" })}
                onDrop={event => handleDrop(event, { kind: "root" })}>
                여기에 놓으면 맨 위 단계로 옮겨요
              </div>
            ) : null}
          </div>
        ) : (
          <div className="grid h-60 place-items-center text-gray-400">
            <Spinner size="large" />
          </div>
        )}
      </section>
    </div>
  );
};

/**
 * inner components
 */
const GroupList = ({ parentId, actions }: GroupListProps) => (
  <div className="flex flex-col">
    {actions.chart.groups
      .filter(group => group.parentId === parentId)
      .map(group => (
        <div key={group.id} className="flex flex-col">
          <div
            className={cn(
              "rounded-medium transition-all duration-150",
              actions.dragging?.kind === "group" ? "my-1 h-4" : "h-3",
              actions.overKey === `before:${group.id}` &&
                "h-8 border border-dashed border-primary-500 bg-primary-50",
            )}
            onDragOver={event =>
              actions.onDragOver(event, { kind: "before", groupId: group.id })
            }
            onDrop={event =>
              actions.onDrop(event, { kind: "before", groupId: group.id })
            }
          />
          <GroupCard group={group} actions={actions} />
        </div>
      ))}
  </div>
);

const GroupCard = ({ group, actions }: GroupCardProps) => {
  // variables
  const hasChildren = actions.chart.groups.some(
    item => item.parentId === group.id,
  );
  const isDragged =
    actions.dragging?.kind === "group" && actions.dragging.id === group.id;
  // render
  return (
    <div className={cn("flex flex-col", isDragged && "opacity-40")}>
      <div
        data-drag-preview
        className="overflow-hidden rounded-large border border-gray-200 bg-white">
        <div
          className={cn(
            "flex items-center gap-2 bg-gray-50 px-2 py-2",
            !actions.isFolded && "border-b border-gray-200",
            actions.overKey === `into:${group.id}` &&
              "bg-primary-50 ring-2 ring-primary-400 ring-inset",
          )}
          onDragOver={event =>
            actions.onDragOver(event, { kind: "into", groupId: group.id })
          }
          onDrop={event =>
            actions.onDrop(event, { kind: "into", groupId: group.id })
          }>
          <span
            draggable
            className="grid size-8 shrink-0 cursor-grab place-items-center rounded-small text-gray-400 hover:bg-gray-100 hover:text-gray-700 active:cursor-grabbing"
            aria-label={`${group.name || "그룹"} 옮기기`}
            onDragStart={event =>
              actions.onDragStart(event, { kind: "group", id: group.id })
            }
            onDragEnd={actions.onDragEnd}>
            <Icon name="grip" size={16} />
          </span>
          <Input
            className="max-w-72"
            size="small"
            value={group.name}
            placeholder="그룹 이름"
            maxLength={40}
            onChange={value => actions.onGroupChange(group.id, value)}
          />
          {actions.isFolded ? (
            <Text
              variant="caption-2"
              color={adminTextLabelColor}
              className="shrink-0">
              인원 {group.people.length}명
            </Text>
          ) : null}
          <div className="ml-auto flex items-center gap-1">
            <Button
              variant="ghost"
              color="primary"
              size="xsmall"
              text="인원 추가"
              leftChildren={<Icon name="plus" size={14} />}
              onClick={() => actions.onPersonAdd(group.id)}
            />
            <button
              type="button"
              aria-label={`${group.name || "그룹"} 지우기`}
              className="grid size-8 place-items-center rounded-small text-gray-400 hover:bg-gray-100 hover:text-red-600"
              onClick={() => actions.onGroupRemove(group.id)}>
              <Icon name="trash" size={16} />
            </button>
          </div>
        </div>
        <div
          className={cn(
            "flex min-h-12 flex-col gap-1 p-2",
            actions.isFolded && "hidden",
            actions.overKey === `people:${group.id}` && "bg-primary-50",
          )}
          onDragOver={event =>
            actions.onDragOver(event, { kind: "people", groupId: group.id })
          }
          onDrop={event =>
            actions.onDrop(event, { kind: "people", groupId: group.id })
          }>
          {group.people.length === 0 ? (
            <Text
              variant="caption-2"
              color={adminTextLabelColor}
              className="px-2 py-2">
              인원이 없어요. 인원 추가를 누르거나 다른 그룹의 인원을 끌어
              오세요.
            </Text>
          ) : (
            group.people.map(person => (
              <PersonRow
                key={person.id}
                group={group}
                person={person}
                actions={actions}
              />
            ))
          )}
        </div>
      </div>
      {hasChildren ? (
        <div className="mt-1 ml-5 border-l-2 border-dashed border-gray-200 pl-4">
          <GroupList parentId={group.id} actions={actions} />
        </div>
      ) : null}
    </div>
  );
};

const PersonRow = ({ group, person, actions }: PersonRowProps) => {
  // variables
  const isDragged =
    actions.dragging?.kind === "person" && actions.dragging.id === person.id;
  const target: DropTarget = {
    kind: "person",
    groupId: group.id,
    personId: person.id,
  };
  // render
  return (
    <div
      data-drag-preview
      className={cn(
        "flex items-center gap-2 border-t-2 border-transparent bg-white px-1 py-1",
        isDragged && "opacity-40",
        actions.overKey === `person:${person.id}` && "border-primary-500",
      )}
      onDragOver={event => actions.onDragOver(event, target)}
      onDrop={event => actions.onDrop(event, target)}>
      <span
        draggable
        className="grid size-8 shrink-0 cursor-grab place-items-center rounded-small text-gray-300 hover:bg-gray-100 hover:text-gray-600 active:cursor-grabbing"
        aria-label={`${person.name || "인원"} 옮기기`}
        onDragStart={event =>
          actions.onDragStart(event, { kind: "person", id: person.id })
        }
        onDragEnd={actions.onDragEnd}>
        <Icon name="grip" size={14} />
      </span>
      <Input
        className="w-32 shrink-0"
        size="small"
        value={person.title}
        placeholder="직함"
        maxLength={30}
        onChange={value =>
          actions.onPersonChange(group.id, person.id, { title: value })
        }
      />
      <Input
        className="min-w-0 flex-1"
        size="small"
        value={person.name}
        placeholder="이름"
        maxLength={40}
        onChange={value =>
          actions.onPersonChange(group.id, person.id, { name: value })
        }
      />
      <button
        type="button"
        aria-label={`${person.name || "인원"} 지우기`}
        className="grid size-8 shrink-0 place-items-center rounded-small text-gray-400 hover:bg-gray-100 hover:text-red-600"
        onClick={() => actions.onPersonRemove(group.id, person.id)}>
        <Icon name="close" size={16} />
      </button>
    </div>
  );
};

/**
 * utils
 */
const readTargetKey = (target: DropTarget) => {
  if (target.kind === "root") {
    return "root";
  }
  if (target.kind === "person") {
    return `person:${target.personId}`;
  }
  return `${target.kind}:${target.groupId}`;
};

const isSelfOrDescendant = (params: IsSelfOrDescendantParams) => {
  const { groups, ancestorId, id } = params;
  let current: string | null = id;
  while (current) {
    if (current === ancestorId) {
      return true;
    }
    current = groups.find(group => group.id === current)?.parentId ?? null;
  }
  return false;
};

const moveGroup = (params: MoveGroupParams): OrganizationChart => {
  const { chart, id, parentId, beforeId } = params;
  const moving = chart.groups.find(group => group.id === id);
  if (!moving || beforeId === id) {
    return chart;
  }
  const rest = chart.groups.filter(group => group.id !== id);
  const next = { ...moving, parentId };
  const index = beforeId ? rest.findIndex(group => group.id === beforeId) : -1;
  if (index < 0) {
    return { groups: [...rest, next] };
  }
  return { groups: [...rest.slice(0, index), next, ...rest.slice(index)] };
};

const movePerson = (params: MovePersonParams): OrganizationChart => {
  const { chart, personId, groupId, beforeId } = params;
  const person = chart.groups
    .flatMap(group => group.people)
    .find(item => item.id === personId);
  if (!person || beforeId === personId) {
    return chart;
  }
  return {
    groups: chart.groups.map(group => {
      const people = group.people.filter(item => item.id !== personId);
      if (group.id !== groupId) {
        return people.length === group.people.length
          ? group
          : { ...group, people };
      }
      const index = beforeId
        ? people.findIndex(item => item.id === beforeId)
        : -1;
      return {
        ...group,
        people:
          index < 0
            ? [...people, person]
            : [...people.slice(0, index), person, ...people.slice(index)],
      };
    }),
  };
};

export default OrganizationScreen;
