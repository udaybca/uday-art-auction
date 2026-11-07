
// ======================================
// ART AUCTION - JAVASCRIPT
// ======================================


// ARTWORK SAMPLE DATA

const artworks = [
    {
        id: 1,
        title: "Abstract Dreams",
        artist: "Sophia Williams",
        category: "Painting",
        price: 1250,
        image: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=700",
        hours: 8
    },

    {
        id: 2,
        title: "Silent Mountains",
        artist: "Daniel Carter",
        category: "Photography",
        price: 850,
        image: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=700",
        hours: 12
    },

    {
        id: 3,
        title: "Modern Elegance",
        artist: "Emma Thompson",
        category: "Sculpture",
        price: 2100,
        image: "https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?w=700",
        hours: 5
    },

    {
        id: 4,
        title: "Colors of Life",
        artist: "Oliver James",
        category: "Painting",
        price: 1750,
        image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=700",
        hours: 15
    },

    {
        id: 5,
        title: "Golden Horizon",
        artist: "Isabella Brown",
        category: "Photography",
        price: 950,
        image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=700",
        hours: 9
    },

    {
        id: 6,
        title: "Creative Forms",
        artist: "Noah Anderson",
        category: "Sculpture",
        price: 2800,
        image: "https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=700",
        hours: 20
    }
];


// SELECT HTML ELEMENTS

const artGrid = document.getElementById("artGrid");

const searchInput = document.getElementById("searchInput");

const filterButtons = document.querySelectorAll(".filter-btn");

const noResults = document.getElementById("noResults");

const menuToggle = document.getElementById("menuToggle");

const navLinks = document.getElementById("navLinks");

const bidModal = document.getElementById("bidModal");

const closeModal = document.getElementById("closeModal");

const bidForm = document.getElementById("bidForm");

const bidAmount = document.getElementById("bidAmount");

const newsletterForm = document.getElementById("newsletterForm");


// APPLICATION STATE

let selectedCategory = "All";

let selectedArtwork = null;

let favoriteArtworks = new Set();


// FORMAT CURRENCY

function formatPrice(price) {

    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0
    }).format(price);

}


// ======================================
// DISPLAY ARTWORK CARDS
// ======================================

function displayArtworks(list) {

    artGrid.innerHTML = "";

    noResults.hidden = list.length !== 0;

    list.forEach(art => {

        const isFavorite = favoriteArtworks.has(art.id);

        const card = document.createElement("article");

        card.className = "art-card";

        card.innerHTML = `

            <div class="art-image">

                <img
                    src="${art.image}"
                    alt="${art.title} by ${art.artist}"
                    loading="lazy">

                <span class="art-category">
                    ${art.category}
                </span>

                <button
                    class="favorite-btn ${isFavorite ? "active" : ""}"
                    data-id="${art.id}"
                    aria-label="${isFavorite ? "Remove from" : "Add to"} favorites"
                    aria-pressed="${isFavorite}">

                    ${isFavorite ? "♥" : "♡"}

                </button>

            </div>


            <div class="art-info">

                <p class="artist-name">
                    BY ${art.artist}
                </p>

                <h3>${art.title}</h3>

                <div class="art-details">

                    <div>

                        <p class="bid-label">
                            Current Bid
                        </p>

                        <p class="bid-price" id="price-${art.id}">
                            ${formatPrice(art.price)}
                        </p>

                        <p class="bid-time" id="timer-${art.id}">
                            Loading...
                        </p>

                    </div>

                    <button
                        class="bid-btn"
                        data-id="${art.id}">

                        Place Bid ↗

                    </button>

                </div>

            </div>

        `;

        artGrid.appendChild(card);

    });

    startCountdowns();

}


// ======================================
// SEARCH AND CATEGORY FILTER
// ======================================

function filterArtworks() {

    const searchText = searchInput.value.toLowerCase().trim();

    const filteredArtworks = artworks.filter(art => {

        const matchesCategory =
            selectedCategory === "All" ||
            art.category === selectedCategory;

        const matchesSearch =
            art.title.toLowerCase().includes(searchText) ||
            art.artist.toLowerCase().includes(searchText) ||
            art.category.toLowerCase().includes(searchText);

        return matchesCategory && matchesSearch;

    });

    displayArtworks(filteredArtworks);

}


// CATEGORY BUTTON EVENTS

filterButtons.forEach(button => {

    button.addEventListener("click", () => {

        filterButtons.forEach(btn => {
            btn.classList.remove("active");
        });

        button.classList.add("active");

        selectedCategory = button.dataset.category;

        filterArtworks();

    });

});


// SEARCH EVENT

searchInput.addEventListener("input", filterArtworks);


// ======================================
// FAVORITE FUNCTIONALITY
// ======================================

artGrid.addEventListener("click", event => {

    const favoriteButton = event.target.closest(".favorite-btn");

    if (!favoriteButton) return;

    const artworkId = Number(favoriteButton.dataset.id);

    if (favoriteArtworks.has(artworkId)) {

        favoriteArtworks.delete(artworkId);

    } else {

        favoriteArtworks.add(artworkId);

    }

    filterArtworks();

});


// ======================================
// COLLECTION CATEGORY FILTER
// ======================================

document.querySelectorAll(".collection-card").forEach(card => {

    card.addEventListener("click", () => {

        const category = card.dataset.collection;

        selectedCategory = category;

        searchInput.value = "";

        filterButtons.forEach(button => {

            button.classList.toggle(
                "active",
                button.dataset.category === category
            );

        });

        filterArtworks();

    });

});


// ======================================
// LIVE AUCTION COUNTDOWN
// ======================================

// Every artwork gets a countdown end time.

const auctionEndTimes = {};

artworks.forEach(art => {

    auctionEndTimes[art.id] =
        Date.now() + art.hours * 60 * 60 * 1000;

});


function startCountdowns() {

    artworks.forEach(art => {

        const timerElement =
            document.getElementById(`timer-${art.id}`);

        if (!timerElement) return;

        const remaining =
            auctionEndTimes[art.id] - Date.now();

        if (remaining <= 0) {

            timerElement.textContent = "Auction ended";

            return;

        }

        const hours = Math.floor(
            remaining / (1000 * 60 * 60)
        );

        const minutes = Math.floor(
            (remaining % (1000 * 60 * 60)) /
            (1000 * 60)
        );

        const seconds = Math.floor(
            (remaining % (1000 * 60)) / 1000
        );

        timerElement.textContent =
            `${hours}h ${minutes}m ${seconds}s left`;

    });

}


// Update countdown every second.

setInterval(startCountdowns, 1000);


// ======================================
// OPEN BIDDING MODAL
// ======================================

function openBidModal(artwork) {

    if (Date.now() >= auctionEndTimes[artwork.id]) {

        alert("Sorry, this auction has ended.");

        return;

    }

    selectedArtwork = artwork;

    document.getElementById("modalTitle").textContent =
        artwork.title;

    document.getElementById("modalCurrentBid").textContent =
        formatPrice(artwork.price);

    bidAmount.value = "";

    bidAmount.min = artwork.price + 1;

    bidAmount.placeholder =
        `Minimum ${formatPrice(artwork.price + 1)}`;

    document.getElementById("bidMessage").textContent = "";

    bidModal.classList.add("show");

    bidModal.setAttribute("aria-hidden", "false");

    document.body.style.overflow = "hidden";

    closeModal.focus();

}


// BID BUTTON EVENT

artGrid.addEventListener("click", event => {

    const bidButton = event.target.closest(".bid-btn");

    if (!bidButton) return;

    const artworkId = Number(bidButton.dataset.id);

    const artwork = artworks.find(
        art => art.id === artworkId
    );

    if (artwork) {

        openBidModal(artwork);

    }

});


// ======================================
// CLOSE BIDDING MODAL
// ======================================

function hideBidModal() {

    bidModal.classList.remove("show");

    bidModal.setAttribute("aria-hidden", "true");

    document.body.style.overflow = "";

    selectedArtwork = null;

}


closeModal.addEventListener("click", hideBidModal);


// Close modal when clicking outside.

bidModal.addEventListener("click", event => {

    if (event.target === bidModal) {

        hideBidModal();

    }

});


// Close modal with Escape key.

document.addEventListener("keydown", event => {

    if (event.key === "Escape" &&
        bidModal.classList.contains("show")) {

        hideBidModal();

    }

});


// ======================================
// PLACE BID FUNCTIONALITY
// ======================================

bidForm.addEventListener("submit", event => {

    event.preventDefault();

    if (!selectedArtwork) return;

    const amount = Number(bidAmount.value);

    const message = document.getElementById("bidMessage");

    if (Date.now() >= auctionEndTimes[selectedArtwork.id]) {

        message.style.color = "#c0392b";

        message.textContent = "This auction has already ended.";

        return;

    }

    if (
        !Number.isFinite(amount) ||
        !Number.isInteger(amount) ||
        amount <= selectedArtwork.price
    ) {

        message.style.color = "#c0392b";

        message.textContent =
            "Please enter a whole number higher than the current bid.";

        return;

    }


    // Update current artwork bid.

    selectedArtwork.price = amount;


    // Update artwork card price.

    const priceElement = document.getElementById(
        `price-${selectedArtwork.id}`
    );

    if (priceElement) {

        priceElement.textContent = formatPrice(amount);

    }


    // Update modal current bid.

    document.getElementById("modalCurrentBid").textContent =
        formatPrice(amount);


    // Set new minimum bid.

    bidAmount.min = amount + 1;

    bidAmount.value = "";

    bidAmount.placeholder =
        `Minimum ${formatPrice(amount + 1)}`;


    message.style.color = "#27834e";

    message.textContent =
        "Your demo bid has been placed successfully!";

});


// ======================================
// MOBILE NAVIGATION
// ======================================

menuToggle.addEventListener("click", () => {

    const isOpen = navLinks.classList.toggle("show");

    menuToggle.setAttribute("aria-expanded", isOpen);

    menuToggle.textContent = isOpen ? "✕" : "☰";

});


// Close menu after clicking a navigation link.

document.querySelectorAll(".nav-links a").forEach(link => {

    link.addEventListener("click", () => {

        navLinks.classList.remove("show");

        menuToggle.setAttribute("aria-expanded", "false");

        menuToggle.textContent = "☰";

    });

});


// ======================================
// NEWSLETTER SUBSCRIPTION
// ======================================

newsletterForm.addEventListener("submit", event => {

    event.preventDefault();

    const email = document.getElementById("emailInput").value.trim();

    const message = document.getElementById("formMessage");

    if (!email) {

        message.textContent = "Please enter your email address.";

        return;

    }

    message.textContent =
        "Thank you! You are now subscribed to ART AUCTION.";

    newsletterForm.reset();

});


// ======================================
// INITIALIZE WEBSITE
// ======================================

displayArtworks(artworks);

console.log("ART AUCTION website loaded successfully!");
