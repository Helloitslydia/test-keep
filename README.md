# AFD Dashboard Monitoring

A modern web application built with React and TypeScript for monitoring and managing AFD (Agence Française de Développement) projects.

## Part 1 - Application Features

### Authentication
- Email/password login system
- Demo account access
- Secure route protection
- User session management

### Project Management
- Project creation and listing
- Project status monitoring (online/offline)
- Progress tracking
- Project phases (Just started, In progress, Completed)
- Comprehensive project details:
  - Budget planning and tracking
  - Timeline management (start/end dates)
  - Geographic information (countries, cities, continents)
  - Beneficiary tracking
  - Short and long descriptions

### Data Visualization
- Multiple visualization types:
  - Circular charts
  - Progress bars
  - Pictogram charts
  - Custom image uploads
- Real-time preview
- Single-entry data points per visualization
- Color customization for pictograms
- Five separate visualization sections (DataViz 1-5)

### Project Resources
- Resource management system
- File and link storage
- Press coverage tracking
- Team member management
- Photo gallery
- Key milestones tracking with status (Completed, In Progress, Pending)

### Budget Management
- Budget planning and tracking
- Expense recording
- Progress visualization
- Remaining budget calculation
- Percentage-based progress tracking

## Part 2 - Development History (Prompts)

1. Initial Design Requirements:
```
For all designs I ask you to make, have them be beautiful, not cookie cutter. Make webpages that are fully featured and worthy for production.

By default, this template supports JSX syntax with Tailwind CSS classes, React hooks, and Lucide React for icons. Do not install other packages for UI themes, icons, etc unless absolutely necessary or I request them.

Use icons from lucide-react for logos.

Use stock photos from unsplash where appropriate, only valid URLs you know exist. Do not download the images, only link to them in image tags.
```

2. Data Visualization Updates:
```
dans la page qui a l'url project/edit, Dans l'onglet "Dataviz 3", l'utilisateur ne doit pouvoir enregistrer qu'une seule fois une donnée
```

3. DataViz Component Standardization:
```
dans la page qui a l'url project/edit, applique la même chose que tu as fait dans "Dataviz 3", pour "Dataviz 4", "Dataviz 5"
```

4. Database Integration:
```
J'aimerai créer une base de donnée Supabase et la connecter. Dans la page "Dashboard", quand on clique sur "Add project", une pop up doit s'ouvrir pour enregistrer le nom d'un nouveau projet, dans une table qui s'appellera "PROJET". Dans la table "PROJET", il doit donc y avoir un field de type texte qui s'appelle "Titre du projet"
```

5. DataViz 4 Integration:
```
dans la page qui a l'URL /project/:id/dataviz/4, au clic du bouton "Add Visualization", tu dois enregistrer les valeurs du projet, qui sont dans les inputs, dans supabase :
L'input "Title" , dans la table "projects, à l'id du project correspondant, dans le champs : dv4_titre
L'input "Visualization Type", dans la table "projects, à l'id du project correspondant, dans le champs : dv4_vizualisation_type
L'input "Value 0-100" dans la table "projects, à l'id du project correspondant, dans le champs : dv4_value
L'input "Select Icon" s'il n'est pas vide, dans la table "projects, à l'id du project correspondant, dans le champs : dv4_nom_icon
L'e picture upload "Custom Image" s'il n'est pas vide, dans la table "projects, à l'id du project correspondant, dans le champs : image_dv4
L'input "Short description of the indicateur" , dans la table "projects », à l'id du project correspondant, dans le champs : dv4_short_description
```

6. DataViz 5 Integration:
```
dans la page qui a l'URL /project/:id/dataviz/5, au clic du bouton "Add Visualization", tu dois enregistrer les valeurs du projet, qui sont dans les inputs, dans supabase :
L'input "Title" , dans la table "projects, à l'id du project correspondant, dans le champs : dv5_titre
L'input "Visualization Type", dans la table "projects, à l'id du project correspondant, dans le champs : dv5_vizualisation_type
L'input "Value 0-100" dans la table "projects, à l'id du project correspondant, dans le champs : dv5_value
L'input "Select Icon" s'il n'est pas vide, dans la table "projects, à l'id du project correspondant, dans le champs : dv5_nom_icon
L'e picture upload "Custom Image" s'il n'est pas vide, dans la table "projects, à l'id du project correspondant, dans le champs : image_dv5
L'input "Short description of the indicateur" , dans la table "projects », à l'id du project correspondant, dans le champs : dv5_short_description
```

7. LinkedIn URL Validation Fix:
```
Fixed validation for LinkedIn URLs in the Team component to properly handle various URL formats and provide better user feedback
```

8. Budget Management Integration:
```
dans la page qui a l'URL /project/:id/budget, au clic du bouton "Add Amount", ajoute que tu dois enregistrer les valeurs du projet, qui sont dans les inputs, dans supabase :
L'input "Budget Planned" , dans la table "projects, à l'id du project correspondant, dans le champs : budget
L'input "Amount of money spent" , dans la table "projects, à l'id du project correspondant, dans le champs : money_spent
```

## Technical Stack

- **Frontend Framework**: React 18
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Routing**: React Router DOM
- **Icons**: Lucide React
- **Database**: Supabase
- **Build Tool**: Vite

## Project Structure

- `/src/components`: Reusable UI components
- `/src/pages`: Main application pages
- `/src/store`: Zustand state management
- `/src/types`: TypeScript type definitions
- `/src/lib`: Utility functions and configurations

## Getting Started

1. Clone the repository
2. Install dependencies:
```bash
npm install
```
3. Start the development server:
```bash
npm run dev
```

## Contributing

Feel free to submit issues and enhancement requests.