import { title } from "process";

const routeConfigs = [
  {
    id: 1,
    category: "navLinks",
    children: [
      { id: 1, href: "/", title: "Home" },
      { id: 2, href: "/about", title: "About" },
      // { id: 3, href: "/journals", title: "Journals" },
      { id: 4, href: "/conference", title: "Conferences" },
      {id:5, href:"/archive",title:"Archive"},
      { id: 6, href: "/contact", title: "Contact" },

    ],
  },
  {
    id: 2,
    category: "discover",
    children: [
      {
        id: 1,
        imageUrl:
          "https://images.unsplash.com/photo-1475906089153-644d9452ce87?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGRpc2NvdmVyJTIwc2NpZW5jZXxlbnwwfDB8MHx8fDA%3D",
        title: "Discover Our Science",
        description:
          "Search all books, journals and book series published by Springer",
        url: "#",
      },
      {
        id: 2,
        imageUrl:
          "https://resource-cms.springernature.com/springer-cms/rest/v1/content/23377250/data/v2",
        title: "Publish a book",
        description: "Ready to publish your book? Find out how",
        url: "#",
      },
      {
        id: 3,
        imageUrl:
          "https://resource-cms.springernature.com/springer-cms/rest/v1/content/23377252/data/v2",
        title: "Submit an article",
        description: "Your research in our journals",
        url: "#",
      },

      {
        id: 4,
        imageUrl:
          "https://resource-cms.springernature.com/springer-cms/rest/v1/content/23377248/data/v3",
        title: "Open access",
        description: "Make your work freely available",
        url: "#",
      },
    ],
  },
];

export default routeConfigs;
