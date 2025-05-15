# React Movie List

**Demo:** https://wizardly-carson-f4d936.netlify.app/

A simple React app that browses movies from TMDB, with authentication, favorites and ratings.

---

## Pages & Components

### Header
- Displays app icon and navigation links:
  - **Home** → `/`
  - **Favorite** → `/favorite`
  - **Rated** → `/rated`
- Shows **Login** button when not authenticated
- Shows username (and logout) when logged in

### Login Page (`/login`)
- Title: **Login**
- Inputs for **Username** and **Password**
- **Submit** button triggers authentication
  - Shows loading spinner while logging in
  - On success, redirects to **Home**
  - On failure, displays error message
- Validates presence of both username and password

### Home Page (`/`)
- Default category: **Now Playing**, page 1
- Category selector: Now Playing, Top Rated, Popular, Upcoming
- Movie grid: 4 cards per row
- Pagination control for current category
- Caches any category‐page already fetched to avoid repeat API calls

### Movie Card
- Shows poster, title, average rating, and a heart icon
- Heart toggles favorite (only when logged in)
- Clicking title navigates to **Movie Details**

### Favorite Page (`/favorite`)
- Displays user’s favorite movies in the same grid layout
- Hidden content if not logged in
- No pagination

### Rated Page (`/rated`)
- Displays movies the user has rated in the same grid layout
- Hidden if not logged in
- No pagination

### Movie Details Page (`/movies/:movieId`)
- Shows full movie details from TMDB
- Displays user’s rating or “Not yet” if unrated
- Rate selector (1–10) and **Rate it** button to submit a rating

---

## Tech Stack & Libraries

- **UI:** Material-UI (`@material-ui/core`, `@material-ui/icons`, `@material-ui/lab`)
- **API:** TMDB via `axios`
- **Form:** Formik & Yup
- **State:** Redux / React Context
- **Routing:** React Router
- **Utilities:** Lodash

