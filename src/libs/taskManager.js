export const taskManager = {
	_tasks: [],

	_timeGap: 1000,
	set timeGap(val) {
		if (!isNaN(val)) {
			this._timeGap = val;
		}
	},

	run: function (func) {
		this._tasks.push({
			task: func,
			running: false
		});

		this._run();
	},

	_run: function () {
		if (window.requestIdleCallback) {
			window.requestIdleCallback(this._runTasks);
		} else {
			setTimeout(() => {
				this._runTasks();
			}, this._timeGap);
		}
	},

	_runTasks: function () {
		if (taskManager._tasks.length > 0) {
			taskManager._runTheFirstTask();

			setTimeout(taskManager._runTasks, taskManager._timeGap);
		}
	},

	_runTheFirstTask: async function () {
		const task = this._tasks[0];
		if (!task.running) {
			task.running = true;

			if (task.task.constructor.name === "AsyncFunction") {
				await task.task();
			} else {
				task.task();
			}
		}

		this._tasks.shift();
	}
};