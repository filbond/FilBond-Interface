export const fileSaver = {
	save: function (filename, content) {
		var element = document.createElement('a');
		element.setAttribute('href', 'data:application/json;charset=utf-8,' + encodeURIComponent(content));
		element.setAttribute('download', filename);
		element.style.display = 'none';
		document.body.appendChild(element);
		element.click();
		document.body.removeChild(element);
	},

	load: function (filename, callback) {
		var element = document.createElement("input");
		element.style.display = 'none';
		element.setAttribute("type", "file");
		document.body.appendChild(element);

		element.addEventListener('change', event => {
			fileSaver._getFile(event, content => {
				callback(content);
				return document.body.removeChild(element);
			});
		});

		element.click();
	},

	_getFile: function (event, callback) {
		const input = event.target
		if ('files' in input && input.files.length > 0) {
			fileSaver._readFileContent(input.files[0]).then(content => {
				if (callback) callback(content);
			}).catch(error => console.error(error));
		}
	},

	_readFileContent: function (file) {
		const reader = new FileReader()
		return new Promise((resolve, reject) => {
			reader.onload = event => resolve(event.target.result)
			reader.onerror = error => reject(error)
			reader.readAsText(file)
		})
	}
}