# Sahmino Frontend

This is the frontend for the Sahmino project, built with Next.js and Tailwind CSS. It provides a user interface for creating and listing items, which are managed by the Django backend API.

## Features
- Create new items with fields: Date, Done by, Task, Type, Quantity, Base GVT, GVT Earned
- List all items
- Bold and green input fields for visibility
- No placeholder text in input boxes before typing
- Responsive and modern UI

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm

### Installation
1. Clone the repository:
	 ```bash
	 git clone https://github.com/AliArefi1993/sahmino-frontend.git
	 cd sahmino-frontend
	 ```
2. Install dependencies:
	 ```bash
	 npm install
	 ```
3. Start the development server:
	 ```bash
	 npm run dev
	 ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### API Connection
- The frontend expects the backend API to be running at `http://localhost:8000`.
- Endpoints used:
	- `GET /api/items/` — List all items
	- `POST /api/items/` — Create a new item

## Project Structure
```
sahmino-frontend/
	src/app/
		page.tsx           # Homepage
		items/
			page.tsx         # List items page
			create/page.tsx  # Create item form
	README.md
```

## Styling
- Uses Tailwind CSS for all styling.
- Input fields are bold and green for visibility.
- No placeholder text is shown before typing.

## Useful Notes for Future Sessions
- All input fields in the create item form are styled for maximum visibility (bold, green, no placeholder).
- Navigation is set up between homepage, items list, and create item pages.
- If you need to add new fields or change styling, edit `src/app/items/create/page.tsx`.
- Backend API endpoints are hardcoded to `http://localhost:8000`.
- For further UI improvements, use Tailwind classes and inline styles as needed.
- If you want to add more pages, follow the structure in `src/app/`.
- For backend changes, see the Django project in the `sahmino` folder.

## License
MIT
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
