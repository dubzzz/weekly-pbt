import fc from 'fast-check';
import 'jest-extended';
import { christmasFactorySchedule, Task } from './christmasFactorySchedule';

describe('christmasFactorySchedule', () => {
  it('basic unit test', () => {
    // Arrange
    const tasks: Task[] = [
      { taskId: 0, estimatedTime: 41, dependsOnTasks: [] },
      { taskId: 1, estimatedTime: 51, dependsOnTasks: [0] },
      { taskId: 2, estimatedTime: 50, dependsOnTasks: [1, 8] },
      { taskId: 3, estimatedTime: 36, dependsOnTasks: [6, 7] },
      { taskId: 4, estimatedTime: 38, dependsOnTasks: [9] },
      { taskId: 5, estimatedTime: 45, dependsOnTasks: [] },
      { taskId: 6, estimatedTime: 21, dependsOnTasks: [9] },
      { taskId: 7, estimatedTime: 32, dependsOnTasks: [0] },
      { taskId: 8, estimatedTime: 32, dependsOnTasks: [6, 7] },
      { taskId: 9, estimatedTime: 29, dependsOnTasks: [0] },
    ];

    // Act
    const schedule = christmasFactorySchedule(tasks);

    // Assert
    expect(schedule).toEqual([
      { taskId: 0, start: 0, finish: 41 },
      { taskId: 1, start: 41, finish: 92 },
      { taskId: 2, start: 123, finish: 173 },
      { taskId: 3, start: 91, finish: 127 },
      { taskId: 4, start: 70, finish: 108 },
      { taskId: 5, start: 0, finish: 45 },
      { taskId: 6, start: 70, finish: 91 },
      { taskId: 7, start: 41, finish: 73 },
      { taskId: 8, start: 91, finish: 123 },
      { taskId: 9, start: 41, finish: 70 },
    ]);
  });

  it('should keep all the tasks for the schedule plan', () => {
    fc.assert(
      fc.property(tasksArbitrary(), (tasks) => {
        // Arrange / Act
        const schedule = christmasFactorySchedule(tasks);

        // Assert
        expect(schedule).toHaveLength(tasks.length);
        expect(schedule.map((t) => t.taskId)).toContainAllValues(tasks.map((t) => t.taskId));
      })
    );
  });

  it('should not extend or reduce the duration of tasks', () => {
    fc.assert(
      fc.property(tasksArbitrary(), (tasks) => {
        // Arrange / Act
        const schedule = christmasFactorySchedule(tasks);

        // Assert
        for (const scheduledTask of schedule) {
          const task = tasks.find((t) => t.taskId === scheduledTask.taskId);
          expect(scheduledTask.finish - scheduledTask.start).toBe(task.estimatedTime);
        }
      })
    );
  });

  it('should not start any task before all its dependencies ended', () => {
    fc.assert(
      fc.property(tasksArbitrary(), (tasks) => {
        // Arrange / Act
        const schedule = christmasFactorySchedule(tasks);

        // Assert
        for (const scheduledTask of schedule) {
          const dependencies = tasks.find((t) => t.taskId === scheduledTask.taskId)!.dependsOnTasks;
          for (const depTaskId of dependencies) {
            const depScheduledTask = schedule.find((s) => s.taskId === depTaskId);
            expect(scheduledTask.start).toBeGreaterThanOrEqual(depScheduledTask.finish);
          }
        }
      })
    );
  });

  it('should start tasks as soon as possible', () => {
    fc.assert(
      fc.property(tasksArbitrary(), (tasks) => {
        // Arrange / Act
        const schedule = christmasFactorySchedule(tasks);

        // Assert
        for (const scheduledTask of schedule) {
          const dependencies = tasks.find((t) => t.taskId === scheduledTask.taskId)!.dependsOnTasks;
          const finishTimeDependencies = dependencies.map((depTaskId) => {
            const depScheduledTask = schedule.find((s) => s.taskId === depTaskId);
            return depScheduledTask.finish;
          });
          const expectedStart = finishTimeDependencies.length !== 0 ? Math.max(...finishTimeDependencies) : 0;
          expect(scheduledTask.start).toBe(expectedStart);
        }
      })
    );
  });
});

// Helpers

function tasksArbitrary(): fc.Arbitrary<Task[]> {
  return fc
    .tuple(
      tasksLayerArbitrary(0), // tasks with ids in 0 to 9, without any dependencies
      tasksLayerArbitrary(1), // tasks with ids in 10 to 19, with possible dependencies onto 0 to 9
      tasksLayerArbitrary(2), // tasks with ids in 20 to 29, with possible dependencies onto 0 to 19
      tasksLayerArbitrary(3) // tasks with ids in 30 to 39, with possible dependencies onto 0 to 29
    )
    .map((layers: Task[][]): Task[] => {
      // Merge all the layers together
      const requestedTasks = layers.flat();
      // List all the ids of tasks used as dependencies of others
      const tasksIdDependencies = [...new Set(requestedTasks.flatMap((t) => t.dependsOnTasks))];
      // Create missing tasks (for dependencies)
      const missingTasks = tasksIdDependencies
        .filter((taskId) => requestedTasks.find((t) => t.taskId === taskId) === undefined)
        .map((taskId) => ({ taskId, estimatedTime: 0, dependsOnTasks: [] }));
      // Return the tasks
      return [...requestedTasks, ...missingTasks];
    });
}

function tasksLayerArbitrary(layer: number): fc.Arbitrary<Task[]> {
  return fc.set(
    fc.record<Task>({
      taskId: fc.integer({ min: layer * 10, max: layer * 10 + 9 }),
      estimatedTime: fc.nat(),
      // Curret layer can have dependencies onto any other previous layer
      dependsOnTasks: layer !== 0 ? fc.set(fc.integer({ min: 0, max: (layer - 1) * 10 + 9 })) : fc.constant([]),
    }),
    { compare: (taskA, taskB) => taskA.taskId === taskB.taskId }
  );
}
