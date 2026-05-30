let items = [
	"Сделать проектную работу",
	"Полить цветы",
	"Пройти туториал по Реакту",
	"Сделать фронт для своего проекта",
	"Прогуляться по улице в солнечный день",
	"Помыть посуду",
];

const listElement = document.querySelector(".to-do__list");
const formElement = document.querySelector(".to-do__form");
const inputElement = document.querySelector(".to-do__input");

function syncStorage() {
	const currentTasks = getTasksFromDOM();
	saveTasks(currentTasks);
}

function loadTasks() {
	const savedData = localStorage.getItem("toDoListTasks");
	if (savedData !== null) {
		return JSON.parse(savedData);
	} else {
		return items;
	}
}

function createItem(itemText) {
	const template = document.getElementById("to-do__item-template");
	const clone = template.content.querySelector(".to-do__item").cloneNode(true);

	const textElement = clone.querySelector(".to-do__item-text");
	const deleteButton = clone.querySelector(".to-do__item-button_type_delete");
	const duplicateButton = clone.querySelector(".to-do__item-button_type_duplicate");
	const editButton = clone.querySelector(".to-do__item-button_type_edit");

	textElement.textContent = itemText;

	deleteButton.addEventListener("click", function () {
		clone.remove();
		syncStorage();
	});

	duplicateButton.addEventListener("click", function () {
		const duplicatedNode = createItem(textElement.textContent);
		listElement.insertBefore(duplicatedNode, listElement.firstChild);
		syncStorage();
	});

	editButton.addEventListener("click", function () {
		textElement.setAttribute("contenteditable", "true");
		textElement.focus();
	});

	textElement.addEventListener("blur", function () {
		textElement.setAttribute("contenteditable", "false");
		syncStorage();
	});

	return clone;
}

function getTasksFromDOM() {
	const itemElements = Array.from(document.querySelectorAll(".to-do__item-text"));
	return itemElements.map(function (element) {
		return element.textContent;
	});
}

function saveTasks(tasksArray) {
	localStorage.setItem("toDoListTasks", JSON.stringify(tasksArray));
}

const loadedTasks = loadTasks();
for (const taskText of loadedTasks) {
	listElement.appendChild(createItem(taskText));
}

formElement.addEventListener("submit", function (event) {
	event.preventDefault();

	const inputValue = inputElement.value.trim();
	if (inputValue === "") {
		return;
	}

	const newNode = createItem(inputValue);
	listElement.insertBefore(newNode, listElement.firstChild);

	syncStorage();
	formElement.reset();
});
