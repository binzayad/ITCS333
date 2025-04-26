// Sample data
const items = [
  { name: "Event A", location: "S-18", date: "2025-04-10", price: 10 },
  { name: "Event B", location: "S-6", date: "2025-04-23", price: 20 },
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

document.getElementById("searchBtn").onclick = () => {
  currentPage = 1;
  update();
};
document.getElementById("sort").onchange = () => {
  currentPage = 1;
  update();
};

window.onload = update;
