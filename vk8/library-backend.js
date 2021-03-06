const { ApolloServer, gql } = require('apollo-server');
const uuid = require('uuid/v1');

let authors = [
    {
        name: 'Robert Martin',
        id: "afa51ab0-344d-11e9-a414-719c6709cf3e",
        born: 1952,
    },
    {
        name: 'Martin Fowler',
        id: "afa5b6f0-344d-11e9-a414-719c6709cf3e",
        born: 1963
    },
    {
        name: 'Fyodor Dostoevsky',
        id: "afa5b6f1-344d-11e9-a414-719c6709cf3e",
        born: 1821
    },
    {
        name: 'Joshua Kerievsky', // birthyear not known
        id: "afa5b6f2-344d-11e9-a414-719c6709cf3e",
    },
    {
        name: 'Sandi Metz', // birthyear not known
        id: "afa5b6f3-344d-11e9-a414-719c6709cf3e",
    },
];

/*
 * It would be more sensible to assosiate book and the author by saving
 * the author id instead of the name to the book.
 * For simplicity we however save the author name.
*/

let books = [
    {
        title: 'Clean Code',
        published: 2008,
        author: 'Robert Martin',
        id: "afa5b6f4-344d-11e9-a414-719c6709cf3e",
        genres: ['refactoring']
    },
    {
        title: 'Agile software development',
        published: 2002,
        author: 'Robert Martin',
        id: "afa5b6f5-344d-11e9-a414-719c6709cf3e",
        genres: ['agile', 'patterns', 'design']
    },
    {
        title: 'Refactoring, edition 2',
        published: 2018,
        author: 'Martin Fowler',
        id: "afa5de00-344d-11e9-a414-719c6709cf3e",
        genres: ['refactoring']
    },
    {
        title: 'Refactoring to patterns',
        published: 2008,
        author: 'Joshua Kerievsky',
        id: "afa5de01-344d-11e9-a414-719c6709cf3e",
        genres: ['refactoring', 'patterns']
    },
    {
        title: 'Practical Object-Oriented Design, An Agile Primer Using Ruby',
        published: 2012,
        author: 'Sandi Metz',
        id: "afa5de02-344d-11e9-a414-719c6709cf3e",
        genres: ['refactoring', 'design']
    },
    {
        title: 'Crime and punishment',
        published: 1866,
        author: 'Fyodor Dostoevsky',
        id: "afa5de03-344d-11e9-a414-719c6709cf3e",
        genres: ['classic', 'crime']
    },
    {
        title: 'The Demon',
        published: 1872,
        author: 'Fyodor Dostoevsky',
        id: "afa5de04-344d-11e9-a414-719c6709cf3e",
        genres: ['classic', 'revolution']
    },
];

const typeDefs = gql`
    type Author {
        id: ID!,
        name: String!,
        born: Int,
        bookCount: Int
    }
    
    type Book {
        id: ID!
        title: String!
        published: Int! 
        author: String!
        genres: [String]!
    }

    type Query {
        bookCount: Int!
        authorCount: Int! 
        allBooks(author: String, genre: String): [Book]!
        allAuthors: [Author]!
    }
    
    type Mutation {
        addBook(
            title: String!
            author: String!
            published: Int!
            genres: [String]!
        ): Book
        
        editAuthor(
            name: String!
            setBornTo: Int!
        ): Author
    }
`;

const resolvers = {
    Query: {
        bookCount: () => books.length,
        authorCount: () => authors.length,
        allBooks: (root, args) => {
            const correctAuthor = ({author}) => args.author ? author === args.author : true;
            const correctGenre = ({genres}) => args.genre ? genres.includes(args.genre) : true;
            return books
                .filter(correctAuthor)
                .filter(correctGenre);
        },
        allAuthors: () => authors
    },
    Mutation: {
        addBook: (root, args) => {
            if(!authors.includes(args.author))
                authors = authors.concat({name: args.author, id: uuid()});

            const book = {...args, id: uuid()};
            books = books.concat(book);
            return book;
        },

        editAuthor: (root, args) => {
            authors = authors.map((author) =>
                author.name === args.name ?
                    {...author, born: args.setBornTo} :
                    author
                );

            return authors.find(author => author.name === args.name);
        }
    },

    Author: {
        bookCount: (root) => books.filter((book) => book.author === root.name).length
    }
};

const server = new ApolloServer({
    typeDefs,
    resolvers,
});

server.listen().then(({ url }) => {
    console.log(`Server ready at ${url}`)
});