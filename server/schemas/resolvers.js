// * `resolvers.js`: Define the query and mutation functionality to work with the Mongoose models.

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
            return Auth.create
        },

        addUser: async (parent, { username, email, password })=> {
            const user = await User.create({ username, email, password });
            return user;
        },

        removeBook: async(parent, { user, bookId })=>{
            return User.findOneAndUpdate(
                { _id: user._id },
                { $pull: { savedBooks: { id: bookId } } },
                { new: true }
                );
        },
    },
};

module.exports = resolvers;