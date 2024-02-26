# CodeMastery - Team N - High Fidelity Prototype

# Date - 13/02/2024

## Project Name

### CodeMastery - Unleash your full programming potential

## Project Management

### Run Commands

#### Client

```sh
cd code/client
npm install
npm run dev #client runs on port 5173
```

#### Server

```sh
cd code/server
npm install
npm start #server runs on port 3001
```

### Client Side

#### Authentication on Client Side

We utilized a React Context for streamlined management of persistent user authentication, providing a centralized solution that seamlessly propagates authentication state across components in our application. This enhances code organization and efficiency while ensuring a cohesive and secure user experience.

#### Pages URL

- \'\*'
  - \<NotFound />
  - Used for **all** the routes that are not included in our application
- '/'
  - \<TopicsList />
  - Used for the **Home** route. It shows the list of all the available topics.
- '/topic/:topic'
  - \<ExercisesList />
  - Used for the Exercises route. It shows the list of the available exercises.
- '/coding/:topic/:exercise'
  - \<CodingPage />
  - Used for the Coding route. It allows the user to attempt a programming exercise.
- '/result/:topic/:exercise'
  - \<ResultsPage />
  - Used for the Result route. It allows the user to check the solution and compare with his/her code.
- '/my-exercises'
  - \<MyExercisesPage />
  - Used for Proposes route. It allows the user, if has got the privileges, to see his/her proposes.
- '/proposals'
  - \<ProposePage />
  - Used for New Propose route. It allows the user to propose a new exercise that will be evaluated.
- '/proposals/:topic/:exercise/edit'
  - \<ProposePage />
  - Used for Edit Propose route. It allows the user to edit a proposal made by him/her.
- '/help'
  - \<DocumentationPage />
  - Used for Documentation route. It allows the user to check how the system works and his functionalities.

#### Libraries

- React-Bootstrap
  - Used for **streamlined integration** of Bootstrap components in React, facilitating efficient UI development.
- TailwindCSS
  - Used for **streamlined UI design**, leveraging its utility-first approach for flexible customization and efficient style management in web projects.
- React-Dom && React-Router-Dom
  - Used for **implementing** the route management in order to develope a SPA
- Sweetalert2
  - Used for **implementing** an alert system that allows the user to take the decisions
- React-Icons
  - Used to easily **incorporate** scalable and customizable icons within our React application, enhancing visual elements and user experience.

#### External Tools

- https://contrastchecker.com/ && http://sipapp.io
  - Used to **ensure** excellent color contrasts within our design.
- https://uicolors.app/create
  - Used to choose **perfect** colors for our system, ensuring a harmonious and visually appealing color scheme.

### Server Side

#### Why Authentication (on Server Side)

In our system, we have intentionally foregone a traditional login system. Instead, the application is preconfigured to operate with a single user, utilizing persistent authentication through the Express library. This approach simplifies user interaction, eliminating the need for explicit login procedures, and aligns with the system's design for a streamlined and user-friendly experience. The singular user setup with Express authentication offers a practical solution for our specific application, ensuring security and ease of use without the complexities associated with a multi-user login system.

#### Why JSON

We opted for JSON over a traditional database due to its efficiency and simplicity. The lightweight nature of JSON aligns seamlessly with the minimalistic requirements of the application, facilitating agile development and rapid prototyping. Its flexible data model allows for dynamic adjustments, crucial during iterative testing phases. The ease of integration with development tools and resource optimization further solidify JSON as the optimal choice for our straightforward testing environment. This strategic decision enhances the application's responsiveness and streamlines data management without unnecessary complexity.

#### Libraries

- Express and Express-Session
  - Used for **persistent** authentication functionality.
- Fs
  - Used for **file management** during reading and writing.
- Cors
  - Utilized for **implementing** secure cross-origin resource sharing (CORS) in the client-server interaction.

#### APIs URL

- /api/session
  - HTTP api: GET
  - Usage: Used for user session checking
- /api/proposals
  - HTTP api: GET
  - Usage: Used for retrieving all the proposes
- /api/proposals/:id
  - HTTP api: GET
  - Usage: Used for retrieving a specific propose
- /api/proposals
  - HTTP api: POST
  - Usage: Used for writing a new propose
- /api/proposals/:id
  - HTTP api: PUT
  - Usage: Used for updating a specific propose
- /api/proposals/:id
  - HTTP api: DELETE
  - Usage: Used for deleting a specific propose
- /api/topics
  - HTTP api: GET
  - Usage: Used for retrieving all the topics
- /api/topics/:topic
  - HTTP api: GET
  - Usage: Used for retrieving a specific topic
- /api/topics/:topic/exercises
  - HTTP api: GET
  - Usage: Used for retrieving all the exercises of a specific topic
- /api/topics/:topic/exercises/:exercise
  - HTTP api: GET
  - Usage: Used for retrieving all the exercises of a specific topic
- /api/topics/:topic/exercises/:exercise/save
  - HTTP api: POST
  - Usage: Used for saving the changes about a specific exercise of a specific topic
- /api/topics/:topic/exercises/:exercise/retry
  - HTTP api: POST
  - Usage: Used for retrying a specific exercises of a specific topic

#### Topic JSON

    {
        "TopicsList": [
            {
                "Title": [Text],
                "Description": [Text],
                "Tot_Exercises": [Integer],
                "Done_Exercises": [Integer],
                "Complete": [Boolean],
                "Medal": ["", Bronze, Silver, Gold, Trophy]
            },
        ]
    }

#### Exercise JSON

    {
        "ExercisesList": {
            "Introduction to Programming": [
                {
                    "Title": [Text]
                    "Description": [Text],
                    "Instruction": [Text],
                    "Level": [Beginner, Intermediate, Advanced],
                    "Status": [Incomplete, Failed, Complete],
                    "Code": [Formatted Code],
                    "Solution": [Formatted Code]
                }
            ],
            ...
        }
    }

#### Proposes JSON

    {
        "ProposesList": [
            {
                "Topic": [Text],
                "Title": [Text],
                "Description": [Text],
                "Instruction": [Text],
                "Level": [Beginner, Intermediate, Advanced],
                "Code": [Formatted Code],
                "Status": [Accepted, Rejected, Pending]
            }
        ]
    }
