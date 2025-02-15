let vendingMachines = [];

// Initialize the map
let map = L.map('map').setView([35.6895, 139.6917], 5); // Default to Japan

// Load Tile Layer (Map Background)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Load vending machine data
fetch('/data/vending_machines.json')
    .then(response => response.json())
    .then(data => {
        vendingMachines = data;
        vendingMachines.forEach(machine => {
            L.marker([machine.lat, machine.lng])
                .addTo(map)
                .bindPopup(machine.name);
        });
    })
    .catch(error => console.error('Error loading vending machine data:', error));

// Find the nearest vending machine
document.getElementById("find-nearest").addEventListener("click", () => {
    if (!navigator.geolocation) {
        alert("Geolocation is not supported by your browser.");
        return;
    }

    navigator.geolocation.getCurrentPosition(position => {
        let userLat = position.coords.latitude;
        let userLng = position.coords.longitude;
        let userLocation = L.latLng(userLat, userLng);

        let nearestMachine = vendingMachines.reduce((closest, machine) => {
            let machineLocation = L.latLng(machine.lat, machine.lng);
            let distance = userLocation.distanceTo(machineLocation);
            return distance < closest.distance ? { machine, distance } : closest;
        }, { machine: null, distance: Infinity });

        if (nearestMachine.machine) {
            alert(`Nearest Pokémon vending machine is at: ${nearestMachine.machine.name}`);
            map.setView([nearestMachine.machine.lat, nearestMachine.machine.lng], 10);
        } else {
            alert("No vending machines found.");
        }
    }, error => {
        alert("Unable to retrieve location.");
        console.error(error);
    });
});
