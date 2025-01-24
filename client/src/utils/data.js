import {
    WhatsApp,
    Twitter,
    Instagram,
    Spotify,
    Linkedin,
    Youtube,
    Google,
    Facebook,
    
} from "../assets";

export const jobTypes = ["Full-Time", "Part-Time", "Contract", "Intern"];

export const experience = [
    { title: "all", value: "0-100" },
    { title: "1 -2 Year", value: "1-2" },
    { title: "2 -6 Year", value: "2-6" },
    { title: "Over 6 Years", value: "6-100" },
];

export const popularSearch = [
    "Software Engineer",
    "Developer",
    "Full-Stack Developer",
    "Data Scientist",
    "Remote",
    "Full-Time",
    "Sales",
    "Office Assistant",
];

export const jobs = [
    {
        id: "1",
        company: {
            name: "Microsoft Corporation",
            location: "Delhi",
            email: "support@microsoft.com",
            contact: "support@microsoft",
            about:
                "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
            profileUrl: Twitter,
        },
        jobTitle: "Software Engineer",
        location: "West US",
        jobType: "Full-Time",
        salary: "1200",
        detail: [
            {
                desc: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",

                requirement:
                    "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
            },
        ],
        applicants: ["1", "2", "3", "4"],
        vacancies: 25,
        createdAt: new Date(),
    },
    {
        id: "2",
        company: {
            name: "Google Corporation",
            location: "Califonia",
            email: "support@google.com",
            contact: "support@google",
            about:
                "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
            profileUrl: Google,
        },
        jobTitle: "System Analyst",
        location: "Mumbai",
        jobType: "Full-Time",
        salary: "1200",
        detail: [
            {
                desc: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",

                requirement:
                    "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
            },
        ],
        applicants: ["1", "2", "3", "4"],
        vacancies: 25,
        createdAt: new Date(),
    },
    {
        id: "3",
        company: {
            name: "LinkedIn Corporation",
            location: "Germany",
            email: "support@microsoft.com",
            contact: "support@microsoft",
            about:
                "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
            profileUrl: Linkedin,
        },
        jobTitle: "Social Meia Manager",
        location: "India, Mumbai",
        jobType: "Full-Time",
        salary: "1200",
        detail: [
            {
                desc: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",

                requirement:
                    "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
            },
        ],
        applicants: ["1", "2", "3", "4"],
        vacancies: 25,
        createdAt: new Date(),
    },
    {
        id: "4",
        company: {
            name: "Spotify Corporation",
            location: "Germany",
            email: "support@microsoft.com",
            contact: "support@microsoft",
            about:
                "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
            profileUrl: Spotify,
        },
        jobTitle: "CFO",
        location: "Norway",
        jobType: "Full-Time",
        salary: "1200",
        detail: [
            {
                desc: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",

                requirement:
                    "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
            },
        ],
        applicants: ["1", "2", "3", "4"],
        vacancies: 25,
        createdAt: new Date(),
    },
    {
        id: "5",
        company: {
            name: "Facebook Corporation",
            location: "Germany",
            email: "support@microsoft.com",
            contact: "support@microsoft",
            about:
                "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
            profileUrl: Facebook,
        },
        jobTitle: "CFO",
        location: "Norway",
        jobType: "Full-Time",
        salary: "1200",
        detail: [
            {
                desc: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",

                requirement:
                    "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
            },
        ],
        applicants: ["1", "2", "3", "4"],
        vacancies: 25,
        createdAt: new Date(),
    },
    {
        id: "6",
        company: {
            name: "WhatsApp Corporation",
            location: "Germany",
            email: "support@microsoft.com",
            contact: "support@microsoft",
            about:
                "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
            profileUrl: WhatsApp,
        },
        jobTitle: "Product Manager",
        location: "Norway",
        jobType: "Full-Time",
        salary: "1200",
        detail: [
            {
                desc: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",

                requirement:
                    "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
            },
        ],
        applicants: ["1", "2", "3", "4"],
        vacancies: 25,
        createdAt: new Date(),
    },
    {
        id: "7",
        company: {
            name: "Instagram Corporation",
            location: "Germany",
            email: "support@microsoft.com",
            contact: "support@microsoft",
            about:
                "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
            profileUrl: Instagram,
        },
        jobTitle: "Product Manager",
        location: "Norway",
        jobType: "Full-Time",
        salary: "1200",
        detail: [
            {
                desc: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",

                requirement:
                    "Lorem Ipsum is simply dummy lorem20 sdjfd sdn fsd ad sa sjd asdv dasn gvajs v sdjna gn gv bne het h t  t hwh  e  e bb   be  veb  brwbw   b text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
            },
        ],
        applicants: ["1", "2", "3", "4"],
        vacancies: 25,
        createdAt: new Date(),
    },
    {
        id: "8",
        company: {
            name: "Youtube Corporation",
            location: "Germany",
            email: "support@microsoft.com",
            contact: "support@microsoft",
            about:
                "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
            profileUrl: Youtube,
        },
        jobTitle: "Product Manager",
        location: "Kolkata",
        jobType: "Full-Time",
        salary: "1200",
        detail: [
            {
                desc: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",

                requirement:
                    "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
            },
        ],
        applicants: ["1", "2", "3", "4"],
        vacancies: 25,
        createdAt: new Date(),
    },
    {
        id: "9",
        company: {
            name: "Harsh InfoTech",
            location: "Lucknow",
            email: "",
            contact: "hinfo@hinfo",
            about:
                "Need a teacher",
            
        },
        jobTitle: "Teacher",
        location: "Lucknow",
        jobType: "Full-Time",
        salary: "12000",
        detail: [
            {
                desc: "Need a teacher",

                requirement:
                    "ABC",
            },
        ],
        applicants: ["1", "2", "3", "4"],
        vacancies: 25,
        createdAt: new Date(),
    },
    
];

export const footerLinks = [
    {
        id: "01",
        title: "Company",
        links: ["Home", "About Us", "Contact","Privacy & Policy"],
    },
];

export const companies = [
    {
        _id: 1,
        name: "Microsoft Corporation",
        location: "Califonia",
        email: "support@microsoft.com",
        contact: "support@microsoft",
        about:
            "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
        profileUrl: Twitter,
        jobPosts: ["1", "2"],
    },
    {
        _id: 2,
        name: "Google Corporation",
        location: "Califonia",
        email: "support@google.com",
        contact: "support@google",
        about:
            "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
        profileUrl: Google,
        jobPosts: ["1", "2"],
    },
    {
        _id: 3,
        name: "LinkedIn Corporation",
        location: "Germany",
        email: "support@microsoft.com",
        contact: "support@microsoft",
        about:
            "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
        profileUrl: Linkedin,
        jobPosts: ["1", "2"],
    },
    {
        _id: 4,
        name: "Spotify Corporation",
        location: "Germany",
        email: "support@microsoft.com",
        contact: "support@microsoft",
        about:
            "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
        profileUrl: Spotify,
        jobPosts: ["1", "2"],
    },
    {
        _id: 5,
        name: "Facebook Corporation",
        location: "Germany",
        email: "support@microsoft.com",
        contact: "support@microsoft",
        about:
            "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
        profileUrl: Facebook,
        jobPosts: ["1", "2"],
    },
    {
        _id: 6,
        name: "WhatsApp Corporation",
        location: "Germany",
        email: "support@microsoft.com",
        contact: "support@microsoft",
        about:
            "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
        profileUrl: WhatsApp,
        jobPosts: ["1", "2"],
    },
    {
        _id: 7,
        name: "Instagram Corporation",
        location: "India",
        email: "support@microsoft.com",
        contact: "support@microsoft",
        about:
            "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
        profileUrl: Instagram,
        jobPosts: ["1", "2"],
    },
    {
        _id: 8,
        name: "Youtube Corporation",
        location: "Germany",
        email: "support@microsoft.com",
        contact: "support@microsoft",
        about:
            "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
        profileUrl: Youtube,
        jobPosts: ["1", "2"],
    },
    {
        _id: 9,
        name: "Compnay List",
        location: "Ghana",
        email: "support@microsoft.com",
        contact: "support@microsoft",
        about:
            "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
        profileUrl: null,
        jobPosts: ["1", "2"],
    },
];

export const users = [
    {
        name: "Rao",
        location: "Califonia",
        email: "support@google.com",
        contact: "support@google",
        about:
            "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
        profileUrl: Google,
        jobPosts: ["1", "2"],
        token: "gjhsdgsjgdjh",
    },
    
];