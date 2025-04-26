// Sample data
const items = [
  { name: "Event A", location: "S-18", date: "2025-04-10", price: 10 },
  { name: "Event B", location: "S-6", date: "2025-03-30", price: 20 },
  { name: "Event C", location: "S-40", date: "2025-04-08", price: 5 },
  // ...add more items as needed
];

let currentPage = 1;
const itemsPerPage = 5;

function renderItems(filteredItems) {
  const list = document.getElementById("item-list");
  list.innerHTML = "";
  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const pageItems = filteredItems.slice(start, end);

  pageItems.forEach((item) => {
    const div = document.createElement("div");
    div.textContent = `${item.name} | Location: ${item.location} | Date: ${item.date} | Price: $${item.price}`;
    list.appendChild(div);
  });
}

function renderPagination(filteredItems) {
  const pagination = document.getElementById("pagination");
  pagination.innerHTML = "";
  const pageCount = Math.ceil(filteredItems.length / itemsPerPage);

  for (let i = 1; i <= pageCount; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;
    btn.disabled = i === currentPage;
    btn.onclick = () => {
      currentPage = i;
      update();
    };
    pagination.appendChild(btn);
  }
}

function update() {
  const searchValue = document
    .getElementById("searchInput")
    .value.toLowerCase();
  const sortValue = document.getElementById("sort").value;

  let filtered = items.filter((item) =>
    item.name.toLowerCase().includes(searchValue)
  );

  const today = new Date();
  switch (sortValue) {
    case "day": // Today
      filtered = filtered.filter((item) => {
        const itemDate = new Date(item.date);
        return (
          itemDate.getFullYear() === today.getFullYear() &&
          itemDate.getMonth() === today.getMonth() &&
          itemDate.getDate() === today.getDate()
        );
      });
      break;
    case "week": // This week (Sunday to Saturday)
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay());
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      filtered = filtered.filter((item) => {
        const itemDate = new Date(item.date);
        return itemDate >= startOfWeek && itemDate <= endOfWeek;
      });
      break;
    case "month-asc": // This month, sorted ascending by date
      filtered = filtered.filter((item) => {
        const itemDate = new Date(item.date);
        return (
          itemDate.getFullYear() === today.getFullYear() &&
          itemDate.getMonth() === today.getMonth()
        );
      });
      filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
      break;
  }

  renderItems(filtered);
  renderPagination(filtered);
}

// Calendar month navigation
const currentDateElem = document.querySelector(".current-date");
const prevIcon = document.querySelector(".icons span:first-child");
const nextIcon = document.querySelector(".icons span:last-child");
const calendarDays = document.querySelector(".calendar ul.days");

let date = new Date();
let currMonth = date.getMonth();
let currYear = date.getFullYear();

function renderCalendar() {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  let firstDayOfMonth = new Date(currYear, currMonth, 1).getDay();
  let lastDateOfMonth = new Date(currYear, currMonth + 1, 0).getDate();
  let lastDayOfMonth = new Date(currYear, currMonth, lastDateOfMonth).getDay();
  let lastDateOfPrevMonth = new Date(currYear, currMonth, 0).getDate();

  // Collect all event days for the current month/year
  const eventDays = items
    .map(item => {
      const d = new Date(item.date);
      if (d.getFullYear() === currYear && d.getMonth() === currMonth) {
        return d.getDate();
      }
      return null;
    })
    .filter(day => day !== null);

  let days = "";

  // Previous month's days
  for (let i = firstDayOfMonth; i > 0; i--) {
    days += `<li class="inactive">${lastDateOfPrevMonth - i + 1}</li>`;
  }
  // Current month's days
  for (let i = 1; i <= lastDateOfMonth; i++) {
    let today = new Date();
    let isToday =
      i === today.getDate() &&
      currMonth === today.getMonth() &&
      currYear === today.getFullYear()
        ? "active"
        : "";
    let hasEvent = eventDays.includes(i) ? "event-day" : "";
    days += `<li class="${isToday} ${hasEvent}">${i}</li>`;
  }
  // Next month's days
  for (let i = lastDayOfMonth + 1; i <= 6; i++) {
    days += `<li class="inactive">${i - lastDayOfMonth}</li>`;
  }

  currentDateElem.textContent = `${months[currMonth]} ${currYear}`;
  calendarDays.innerHTML = days;
}

prevIcon.onclick = () => {
  currMonth--;
  if (currMonth < 0) {
    currMonth = 11;
    currYear--;
  }
  renderCalendar();
};

nextIcon.onclick = () => {
  currMonth++;
  if (currMonth > 11) {
    currMonth = 0;
    currYear++;
  }
  renderCalendar();
};

document.getElementById("searchBtn").onclick = () => {
  currentPage = 1;
  update();
};
document.getElementById("sort").onchange = () => {
  currentPage = 1;
  update();
};

window.onload = function () {
  update();
  renderCalendar();
};
