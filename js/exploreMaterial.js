// Sample course data
const coursesData = [
  {
    id: 1,
    name: "Data Structures",
    doctor: "Dr. Ahmed Hassan",
    major: "CS",
    year: "1",
    type: "required",
    lectures: 32,
    pdfs: 12,
    icon: "fa-sitemap",
  },
  {
    id: 2,
    name: "Discrete Mathematics",
    doctor: "Dr. Samira Ahmed",
    major: "CS",
    year: "1",
    type: "required",
    lectures: 28,
    pdfs: 10,
    icon: "fa-square-root-variable",
  },
  {
    id: 3,
    name: "Introduction to Programming",
    doctor: "Dr. Mohamed Ali",
    major: "CS",
    year: "1",
    type: "required",
    lectures: 40,
    pdfs: 15,
    icon: "fa-code",
  },
  {
    id: 4,
    name: "Web Development Basics",
    doctor: "Dr. Fatima Ibrahim",
    major: "CS",
    year: "2",
    type: "elective",
    lectures: 24,
    pdfs: 8,
    icon: "fa-globe",
  },
  {
    id: 5,
    name: "Algorithms Analysis",
    doctor: "Dr. Ahmed Hassan",
    major: "CS",
    year: "2",
    type: "required",
    lectures: 30,
    pdfs: 12,
    icon: "fa-diagram-project",
  },
  {
    id: 6,
    name: "Database Systems",
    doctor: "Dr. Omar Fahmy",
    major: "CS",
    year: "2",
    type: "required",
    lectures: 28,
    pdfs: 10,
    icon: "fa-database",
  },
  {
    id: 7,
    name: "Machine Learning Basics",
    doctor: "Dr. Noor Hassan",
    major: "AI",
    year: "3",
    type: "required",
    lectures: 35,
    pdfs: 14,
    icon: "fa-brain",
  },
  {
    id: 8,
    name: "Deep Learning",
    doctor: "Dr. Karim Saleh",
    major: "AI",
    year: "3",
    type: "elective",
    lectures: 32,
    pdfs: 11,
    icon: "fa-network-wired",
  },
  {
    id: 9,
    name: "Natural Language Processing",
    doctor: "Dr. Lina Mohammad",
    major: "AI",
    year: "4",
    type: "elective",
    lectures: 28,
    pdfs: 9,
    icon: "fa-language",
  },
  {
    id: 10,
    name: "Data Analytics",
    doctor: "Dr. Youssef Ahmed",
    major: "DS",
    year: "2",
    type: "required",
    lectures: 30,
    pdfs: 11,
    icon: "fa-chart-bar",
  },
  {
    id: 11,
    name: "Statistical Methods",
    doctor: "Dr. Hana Mahmoud",
    major: "DS",
    year: "3",
    type: "required",
    lectures: 26,
    pdfs: 9,
    icon: "fa-chart-pie",
  },
  {
    id: 12,
    name: "Big Data Technologies",
    doctor: "Dr. Sami Hassan",
    major: "DS",
    year: "3",
    type: "elective",
    lectures: 24,
    pdfs: 8,
    icon: "fa-hard-drive",
  },
  {
    id: 13,
    name: "Object-Oriented Programming",
    doctor: "Dr. Rania Samir",
    major: "CS",
    year: "1",
    type: "required",
    lectures: 33,
    pdfs: 13,
    icon: "fa-cube",
  },
  {
    id: 14,
    name: "Operating Systems",
    doctor: "Dr. Tarek Adel",
    major: "CS",
    year: "2",
    type: "required",
    lectures: 29,
    pdfs: 10,
    icon: "fa-microchip",
  },
  {
    id: 15,
    name: "Computer Networks",
    doctor: "Dr. Salma Nabil",
    major: "CS",
    year: "3",
    type: "required",
    lectures: 31,
    pdfs: 11,
    icon: "fa-wifi",
  },
];

// State management
let filteredCourses = [...coursesData];
let currentFilters = {
  major: "all",
  year: "all",
  type: "all",
  searchTerm: "",
};
let currentSort = "name";

// DOM Elements
const searchInput = document.getElementById("searchInput");
const searchClear = document.getElementById("searchClear");
const coursesGrid = document.getElementById("coursesGrid");
const resultCount = document.getElementById("resultCount");
const noResults = document.getElementById("noResults");
const resetFilters = document.getElementById("resetFilters");
const sortSelect = document.getElementById("sortSelect");
const majorFilterBtns = document.querySelectorAll(".filter-btn-major");
const yearFilterBtns = document.querySelectorAll(".filter-btn-year");
const typeFilterBtns = document.querySelectorAll(".filter-btn-type");

// Event Listeners
searchInput.addEventListener("input", handleSearch);
searchClear.addEventListener("click", clearSearch);
resetFilters.addEventListener("click", handleResetFilters);
sortSelect.addEventListener("change", handleSort);

majorFilterBtns.forEach((btn) =>
  btn.addEventListener("click", () => handleMajorFilter(btn)),
);
yearFilterBtns.forEach((btn) =>
  btn.addEventListener("click", () => handleYearFilter(btn)),
);
typeFilterBtns.forEach((btn) =>
  btn.addEventListener("click", () => handleTypeFilter(btn)),
);

// Filter Handlers
function handleSearch(e) {
  const searchTerm = e.target.value.toLowerCase().trim();
  currentFilters.searchTerm = searchTerm;

  // Show/hide clear button
  searchClear.classList.toggle("hidden", !searchTerm);

  applyFilters();
}

function clearSearch() {
  searchInput.value = "";
  currentFilters.searchTerm = "";
  searchClear.classList.add("hidden");
  applyFilters();
}

function handleMajorFilter(btn) {
  // Remove active state from all buttons
  majorFilterBtns.forEach((b) => {
    b.classList.remove("active", "bg-dark-700");
    b.querySelector("i").classList.add("hidden");
  });

  // Add active state to clicked button
  btn.classList.add("active", "bg-dark-700");
  btn.querySelector("i").classList.remove("hidden");

  currentFilters.major = btn.dataset.major;
  applyFilters();
}

function handleYearFilter(btn) {
  yearFilterBtns.forEach((b) => {
    b.classList.remove("active", "bg-dark-700");
    b.querySelector("i").classList.add("hidden");
  });

  btn.classList.add("active", "bg-dark-700");
  btn.querySelector("i").classList.remove("hidden");

  currentFilters.year = btn.dataset.year;
  applyFilters();
}

function handleTypeFilter(btn) {
  typeFilterBtns.forEach((b) => {
    b.classList.remove("active", "bg-dark-700");
    b.querySelector("i").classList.add("hidden");
  });

  btn.classList.add("active", "bg-dark-700");
  btn.querySelector("i").classList.remove("hidden");

  currentFilters.type = btn.dataset.type;
  applyFilters();
}

function handleResetFilters() {
  // Reset filter states
  currentFilters = {
    major: "all",
    year: "all",
    type: "all",
    searchTerm: "",
  };

  // Update UI
  searchInput.value = "";
  searchClear.classList.add("hidden");
  sortSelect.value = "name";
  currentSort = "name";

  // Reset all filter buttons
  majorFilterBtns.forEach((btn) => {
    btn.classList.remove("bg-dark-700");
    btn.querySelector("i").classList.add("hidden");
    if (btn.dataset.major === "all") {
      btn.classList.add("active", "bg-dark-700");
      btn.querySelector("i").classList.remove("hidden");
    }
  });

  yearFilterBtns.forEach((btn) => {
    btn.classList.remove("bg-dark-700");
    btn.querySelector("i").classList.add("hidden");
    if (btn.dataset.year === "all") {
      btn.classList.add("active", "bg-dark-700");
      btn.querySelector("i").classList.remove("hidden");
    }
  });

  typeFilterBtns.forEach((btn) => {
    btn.classList.remove("bg-dark-700");
    btn.querySelector("i").classList.add("hidden");
    if (btn.dataset.type === "all") {
      btn.classList.add("active", "bg-dark-700");
      btn.querySelector("i").classList.remove("hidden");
    }
  });

  applyFilters();
}

function handleSort(e) {
  currentSort = e.target.value;
  renderCourses(filteredCourses);
}

// Main filtering function
function applyFilters() {
  filteredCourses = coursesData.filter((course) => {
    // Major filter
    if (
      currentFilters.major !== "all" &&
      course.major !== currentFilters.major
    ) {
      return false;
    }

    // Year filter
    if (currentFilters.year !== "all" && course.year !== currentFilters.year) {
      return false;
    }

    // Type filter
    if (currentFilters.type !== "all" && course.type !== currentFilters.type) {
      return false;
    }

    // Search filter
    if (currentFilters.searchTerm) {
      const searchTerm = currentFilters.searchTerm;
      return (
        course.name.toLowerCase().includes(searchTerm) ||
        course.doctor.toLowerCase().includes(searchTerm) ||
        course.major.toLowerCase().includes(searchTerm)
      );
    }

    return true;
  });

  // Sort results
  sortCourses();

  // Render courses
  renderCourses(filteredCourses);
}

function sortCourses() {
  if (currentSort === "name") {
    filteredCourses.sort((a, b) => a.name.localeCompare(b.name));
  } else if (currentSort === "year") {
    filteredCourses.sort((a, b) => parseInt(a.year) - parseInt(b.year));
  } else if (currentSort === "doctor") {
    filteredCourses.sort((a, b) => a.doctor.localeCompare(b.doctor));
  }
}

// Render courses
function renderCourses(courses) {
  coursesGrid.innerHTML = "";

  if (courses.length === 0) {
    noResults.classList.remove("hidden");
    resultCount.textContent = "0";
    return;
  }

  noResults.classList.add("hidden");
  resultCount.textContent = courses.length;

  courses.forEach((course) => {
    const yearBadgeColor = getYearBadgeColor(course.year);
    const typeIcon = course.type === "required" ? "fa-star" : "fa-circle";
    const typeLabel = course.type === "required" ? "Required" : "Elective";

    const courseCard = document.createElement("div");
    courseCard.className =
      "glass-panel rounded-2xl border border-dark-700 p-6 hover:border-primary-500/50 transition-all group cursor-pointer overflow-hidden relative";

    courseCard.innerHTML = `
      <!-- Background gradient on hover -->
      <div class="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-accent-purple/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>

      <div class="relative z-10">
        <!-- Header with icon and type -->
        <div class="flex items-start justify-between mb-4">
          <div class="w-12 h-12 rounded-xl bg-dark-700 flex items-center justify-center text-primary-500 group-hover:bg-primary-500 group-hover:text-dark-900 transition-all">
            <i class="fa-solid ${course.icon} text-lg"></i>
          </div>
          <span class="text-xs font-semibold px-3 py-1 rounded-full bg-dark-700 flex items-center gap-1.5">
            <i class="fa-solid ${typeIcon} text-primary-500 text-xs"></i>
            ${typeLabel}
          </span>
        </div>

        <!-- Course name -->
        <h3 class="text-lg font-bold mb-2 group-hover:text-primary-500 transition-colors line-clamp-2">
          ${course.name}
        </h3>

        <!-- Doctor name -->
        <div class="flex items-center gap-2 mb-4 text-gray-400 text-sm">
          <i class="fa-solid fa-user-tie text-primary-500/70"></i>
          <span class="truncate">${course.doctor}</span>
        </div>

        <!-- Year badge -->
        <div class="flex items-center gap-2 mb-4">
          <span class="text-xs font-semibold px-2.5 py-1 rounded-full bg-${yearBadgeColor}-500/20 text-${yearBadgeColor}-400 border border-${yearBadgeColor}-500/30">
            Year ${course.year}
          </span>
          <span class="text-xs text-gray-500">${getMajorLabel(course.major)}</span>
        </div>

        <!-- Stats -->
        <div class="flex items-center justify-between pt-4 border-t border-dark-700">
          <div class="flex items-center gap-4">
            <div class="text-center">
              <div class="text-primary-500 font-bold text-lg">${course.lectures}</div>
              <div class="text-xs text-gray-500">Lectures</div>
            </div>
            <div class="w-px h-8 bg-dark-700"></div>
            <div class="text-center">
              <div class="text-primary-500 font-bold text-lg">${course.pdfs}</div>
              <div class="text-xs text-gray-500">PDFs</div>
            </div>
          </div>
          <button class="w-10 h-10 rounded-lg bg-primary-500/10 hover:bg-primary-500 text-primary-500 hover:text-dark-900 flex items-center justify-center transition-all border border-primary-500/30 group-hover:border-primary-500">
            <i class="fa-solid fa-arrow-right"></i>
          </button>
        </div>
      </div>
    `;

    coursesGrid.appendChild(courseCard);
  });
}

// Utility functions
function getYearBadgeColor(year) {
  const colors = {
    1: "yellow",
    2: "blue",
    3: "purple",
    4: "red",
  };
  return colors[year] || "gray";
}

function getMajorLabel(major) {
  const labels = {
    CS: "Computer Science",
    DS: "Data Science",
    AI: "AI & ML",
  };
  return labels[major] || major;
}

// Initial render
document.addEventListener("DOMContentLoaded", () => {
  renderCourses(filteredCourses);
});
