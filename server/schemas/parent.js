const index = require("../index");
const { Text, Relationship, Password, Select } = require("@keystonejs/fields");
const Stripe = require("stripe");
const keystone = index.indexKey;

console.log("Creating Parent");
keystone.createList("Parent", {
  fields: {
    suffix: { type: Select, options: "Mr., Mrs., Ms." },
    first_name: { type: Text },
    last_name: { type: Text },
    email: {
      type: Text,
      isUnique: true,
      isRequired: true,
    },
    password: {
      type: Password,
      isRequired: true,
    },
    phone: { type: Text, isRequired: true },
    child: { type: Relationship, ref: "Child", many: true },
    approved_contact: {
      type: Relationship,
      ref: "ApprovedContact",
      many: true,
    },
    stripeId: { type: Text },
  },
  labelResolver: (item) => `${item.suffix} ${item.last_name}`,
});
