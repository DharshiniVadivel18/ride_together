document.addEventListener("DOMContentLoaded", () => {
    const screens = {
        landingPage: document.getElementById("landingPage"),
        loginScreen: document.getElementById("loginScreen"),
        driverScreen: document.getElementById("driverScreen"),
        passengerScreen: document.getElementById("passengerScreen"),
    };

    const routes = JSON.parse(localStorage.getItem("routes")) || [];

    document.getElementById("getStarted").addEventListener("click", () => {
        switchScreen("landingPage", "loginScreen");
    });

    document.getElementById("loginForm").addEventListener("submit", (e) => {
        e.preventDefault();
        const role = document.getElementById("userRole").value;
        const password = document.getElementById("password").value;
        // Here you could add additional password validation, if needed
        switchScreen("loginScreen", role === "driver" ? "driverScreen" : "passengerScreen");
    });

    document.querySelectorAll(".back-button").forEach((btn) => {
        btn.addEventListener("click", () => {
            switchScreen(btn.closest(".screen").id, "loginScreen");
        });
    });

    document.getElementById("driverForm").addEventListener("submit", (e) => {
        e.preventDefault();
        const route = {
            vehicle: document.getElementById("vehicle").value,
            start: document.getElementById("start").value,
            end: document.getElementById("end").value,
            time: document.getElementById("time").value,
            mobile: document.getElementById("mobile").value,
        };
        routes.push(route);
        localStorage.setItem("routes", JSON.stringify(routes));
        displayDriverRoutes();
    });

    document.getElementById("searchForm").addEventListener("submit", (e) => {
        e.preventDefault();
        const start = document.getElementById("searchStart").value;
        const end = document.getElementById("searchEnd").value;

        const filteredRoutes = routes.filter(
            (route) => route.start.toLowerCase() === start.toLowerCase() && route.end.toLowerCase() === end.toLowerCase()
        );

        const availableRoutes = document.getElementById("availableRoutes");
        availableRoutes.innerHTML = filteredRoutes.length
            ? filteredRoutes
                  .map(
                      (route) =>
                          `<li>
                              ${route.vehicle} from ${route.start} to ${route.end} at ${route.time} 
                              <button onclick='alert("Driver Mobile: ${route.mobile}")'>Accept</button>
                              <button class="reject" onclick='rejectRoute("${route.start}", "${route.end}")'>Reject</button>
                          </li>`
                  )
                  .join("")
            : "<li>No routes found</li>";
    });

    function displayDriverRoutes() {
        const driverRoutes = document.getElementById("driverRoutes");
        driverRoutes.innerHTML = routes
            .map(
                (route, index) =>
                    `<li>${route.vehicle} from ${route.start} to ${route.end} at ${route.time} 
                        <button onclick="deleteRoute(${index})">Delete</button>
                    </li>`
            )
            .join("");
    }

    window.deleteRoute = (index) => {
        routes.splice(index, 1);
        localStorage.setItem("routes", JSON.stringify(routes));
        displayDriverRoutes();
    };

    window.rejectRoute = (start, end) => {
        // Show rejection message
        const rejectedMessage = document.getElementById("rejectedMessage");
        rejectedMessage.style.display = "block";

        // Optionally, you can hide the route from the list
        const availableRoutes = document.getElementById("availableRoutes");
        availableRoutes.innerHTML = availableRoutes.innerHTML.replace(
            new RegExp(`.*from ${start} to ${end}.*`, 'g'),
            `<li class="rejected">Rejected: ${start} to ${end}</li>`
        );
    };

    function switchScreen(from, to) {
        screens[from].classList.remove("active");
        screens[to].classList.add("active");
    }

    displayDriverRoutes();
});
