import React, { useState } from 'react';
import {
    DndContext,
    closestCenter,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {SortableItem} from "@/pages/SortableItem";

const initialItems = ['Item 1', 'Item 2', 'Item 3', 'Item 4'];

function App() {
    const [items, setItems] = useState(initialItems);

    const handleDragEnd = (event) => {
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
                    <SortableItem key={id} id={id} />
                ))}
            </SortableContext>
        </DndContext>
    );
}

export default App;
