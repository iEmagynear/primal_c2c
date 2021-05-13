const index = require("../index");
const {
  Text,
  Checkbox,
  Password,
  Relationship,
  DateTime,
  File,
} = require("@keystonejs/fields");
const keystone = index.indexKey;
const fileAdapter = index.s3Adapter;

console.log("Creating Staff");
keystone.createList("StaffMember", {
  fields: {
    profile_pic: {
      type: File,
      adapter: fileAdapter,
    },
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
    phone: { type: Text },
    location: { type: Relationship, ref: "Location", many: false },
    schedule: { type: Relationship, ref: "Schedule", many: false },
    time_card: { type: Relationship, ref: "StaffTimecard", many: false },
  },
  labelResolver: (item) => `${item.first_name} ${item.last_name}`,
});
