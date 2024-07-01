import React, { useState } from 'react';
import {
    DndContext,
    closestCenter,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext, useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {CSS} from "@dnd-kit/utilities";
import {TableItem} from "@/components/TableItem";

const initialItems = ['Item 1', 'Item 2', 'Item 3', 'Item 4'];

export default function App() {
    const [items, setItems] = useState(initialItems);

    const handleDragEnd = (event:any) => {
        const { active, over } = event;

        if (active.id !== over.id) {
            setItems((items) => {
                const oldIndex = items.indexOf(active.id);
                const newIndex = items.indexOf(over.id);
                return arrayMove(items, oldIndex, newIndex);
            });
        }
    };

    return (
        <DndContext
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
        >
            <SortableContext
                items={items}
                strategy={verticalListSortingStrategy}
            >
                {items.map((id) => (
                    <TableItem key={id} id={id} />
                ))}
            </SortableContext>
        </DndContext>
    );
}

