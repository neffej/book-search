// * `resolvers.js`: Define the query and mutation functionality to work with the Mongoose models.
const { AuthenticationError }= require('apollo-server-express');
const { User, Book } = require('../models');

const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        me: async (parent, { userId }) => {
            return User.findOne({ _id: userId });
        },
    },

    Mutation: {
        login: async(parent, { email, password })=>{
            const user = await User.findone({ email });

            if(!user){
                throw new AuthenticationError('No user found with this email address');
            }

            const correctPw = await user.isCorrectPassword(password);

            if(!correctPw){
                throw new AuthenticationError("Incorrect credentials");
            }
            const token = signToken(user);

            return { token, user };
        },

        addUser: async (parent, { username, email, password })=> {
            const user = await User.create({ username, email, password });
            const token = signToken(user);
            return { token, user };
        },

        saveBook: async (parent, args, context) => {
            if (context.user) {
                const updatedUserBooks = await User.findOneAndUpdate(
                    {_id: context.user._id},
                    {$addToSet: { savedBooks: args } },
                    {
                        new: true,
                        runValidators: true,
                    }
                );
                return updatedUserBooks;
            }
        },

        removeBook: async(parent, { user, bookId })=>{
            const updatedBooks = await User.findOneAndUpdate(
                { _id: user._id },
                { $pull: { savedBooks: { id: bookId } } },
                { new: true }
                );
            return updatedBooks;
        },
    },
};

module.exports = resolvers;