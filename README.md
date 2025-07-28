# Anora Frontend Software Engineer Assessment

## Setup

Clone the repo using `git clone https://github.com/detachedsoul/anora-frontend-task.git`. After that install the dependencies using any package manager of your choice, `npm install` or `yarn install`.

## Architectural Decisions

I used Nextjs as my framework of choice, Zustand for state manage due to its straightforward and easy to use nature.

For form validations I used React-Hook-Form and paired it with Zod. Lucide React was used for the icons.

## Tradeoffs

From the specifictions of the assessment we were to use styled-components or css modules. I tried it and it turns out that it didn't scale well. I decided to use Tailwind CSS for styling since most of the earliest concerns with using it for smaller projects like bundle size is no longer an issue since only used CSS classes are shipped to production.

## Portfolio Review

The most challenging frontend project I ever worked on would be ContatHub. I was to ensure PWA compatibility on both desktop, android and iOS. I was also to implement push notifications with custom notifications as well as work with a new technology (Back4App which uses Parse platform for the backend of the project).

I measure success when all the features I was supposed to implement are working as expected.

## Code Reviews / Collaborations

I've had a pretty decent collaboration with designers. Communication has always been key not just during the implementation phase, but even during the design phase.

I see code reviews as an opportunity to learn. Other might have a different and more efficient method of doing things and this is something that helps me grow.

I use Git for version control and it is something I can't do without. I also try as much as possible to make my commit messages more descriptive so I can know what each piece of code does. This helps track issues and also helps collaboration since other developers can know what I was working on without having to spend hours going through the whole code.

For browser compatibility, I try as much as possible to test my work on different devices.operating systems, not just relying on one single device and then hoping that I have the same effect on all platforms.

For code quality, I try as much as possible to follow best practices and also keep up with modern trends.

To be honest I haven't really written any form of test before. However, I also make sure to work on features independently and then move on to the next after I must have been done with it.
