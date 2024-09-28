const totalSeats = 80;
const seatsPerRow = 7;
const seatGrid = document.querySelector('.seat-grid');
let seats = [];

// Function to initialize the seats
function initializeSeats() {
    for (let i = 1; i <= totalSeats; i++) {
        const seat = {
            id: i,
            booked: false,
        };
        seats.push(seat);
    }
}

// Function to create seat layout (10 rows with 7 seats each)
function createSeatLayout() {
    seats.forEach(seat => {
        const seatElement = document.createElement('div');
        seatElement.classList.add('seat');
        seatElement.innerText = seat.id;
        seatElement.dataset.id = seat.id;

        // Check if the seat is booked from localStorage
        if (localStorage.getItem(`seat_${seat.id}`) === 'true') {
            seat.booked = true; // Mark as booked
            seatElement.classList.add('booked'); // Add booked class
        }

        seatGrid.appendChild(seatElement);

        // Add click event to toggle selection
        seatElement.addEventListener('click', () => {
            if (!seat.booked) {
                seatElement.classList.toggle('selected');
            } else {
                alert("This seat is already booked.");
            }
        });
    });
}

// Function to check and reset all seats if all are booked
function checkAndResetSeats() {
    if (seats.every(seat => seat.booked)) {
        // If all seats are booked, reset booking status
        seats.forEach(seat => {
            seat.booked = false; // Set booked status to false
            localStorage.removeItem(`seat_${seat.id}`); // Remove from localStorage
        });
        alert("All seats were booked. Resetting to available for the next trip.");
        // Reload the page to reflect changes
        location.reload();
    }
}

initializeSeats(); // Initialize seat data
createSeatLayout(); // Create seat layout
checkAndResetSeats(); // Check and reset if needed

document.getElementById('bookButton').addEventListener('click', bookSeats);

function bookSeats() {
    // Check if all seats are booked
    if (seats.every(seat => seat.booked)) {
        alert("Sorry, all seats are booked for this available time.refresh and book your seats for next available time.");
        return;
    }

    const seatCount = parseInt(document.getElementById('seatCount').value);
    
    // Check valid input for seat count
    if (isNaN(seatCount) || seatCount < 1 || seatCount > 7) {
        alert("Please enter a valid number of seats (1-7).");
        return;
    }

    // Get selected seats
    const selectedSeats = seatGrid.querySelectorAll('.seat.selected');
    const selectedCount = selectedSeats.length;

    // Validate selected seats
    if (selectedCount < seatCount) {
        alert(`Please select exactly ${seatCount} seat(s).`);
        return;
    } else if (selectedCount > seatCount) {
        alert(`You can only select ${seatCount} seat(s).`);
        return;
    }

    // Confirm booking
    const seatsToBook = [];
    selectedSeats.forEach(seatElement => {
        const seatId = parseInt(seatElement.dataset.id);
        seatsToBook.push(seatId);
    });

    // Mark seats as booked
    seatsToBook.forEach(seatId => {
        seats[seatId - 1].booked = true; // Mark seat as booked
        localStorage.setItem(`seat_${seatId}`, 'true'); // Save booked seat in localStorage
        const seatElement = seatGrid.querySelector(`div[data-id='${seatId}']`);
        seatElement.classList.add('booked'); // Add booked class to UI
    });

    alert(`Seats booked: ${seatsToBook.join(", ")}`);

    // Clear selected seats after booking
    selectedSeats.forEach(seatElement => {
        seatElement.classList.remove('selected');
    });

    // Reset the input field
    document.getElementById('seatCount').value = ''; // Clear input field
}
