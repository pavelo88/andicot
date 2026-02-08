# **App Name**: StarkOS Database Blueprint

## Core Features:

- Web Data Configuration: Store website configuration details including hero section text, statistics, contact information, social media links, guarantee policies, color palettes for dark and light modes, and brand logos in Firestore.
- Services Collection: Create and manage a 'servicios' collection in Firestore, where each document represents a service offered by ANDICOT, including service ID, title, icon, description, and base price.
- Color Theme Management: Implement color theming based on the 'Paleta_Colores' data in Firestore, dynamically adjusting the application's appearance based on the selected mode (Dark or Light), managed by a tool which assesses available colors and chooses the most accessible and effective one.
- Real-time Updates: Leverage Firestore's real-time capabilities to push updates to the ANDICOT Stark OS platform whenever data in the 'configuracion/web_data' document or the 'servicios' collection is modified.

## Style Guidelines:

- Primary color (Dark Mode): Electric cyan (#00f2ff) for a futuristic, technological feel.
- Background color (Dark Mode): Dark gray (#121212) to enhance the contrast with the primary color.
- Accent color: Teal (#008080) to complement the cyan and add depth.
- Primary color (Light Mode): Strong blue (#0077ff) for professionalism and clarity.
- Background color (Light Mode): Off-white (#f1f3f5) for a clean and modern appearance.
- Accent color: Royal blue (#4169E1) for CTAs and highlights.
- Headline font: 'Space Grotesk' sans-serif for a modern and tech-oriented style.
- Body font: 'Inter' sans-serif for readability and clarity.
- Use flat, line-art style icons to represent services and categories. Ensure icons are consistent in style and weight.
- Implement a clean, grid-based layout with sufficient whitespace to improve readability and visual appeal. Use clear visual hierarchy to guide the user's eye.
- Subtle animations and transitions to provide feedback and enhance the user experience. Use animations sparingly to avoid distracting the user.