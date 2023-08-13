/**
 * @jest-environment node
 */

import keysToCamelCase from "@/keysToCamelCase";

describe("keysToCamelCase", () => {
  it("should convert top level keys to camelCase", () => {
    const input = {
      first_name: "John",
      last_name: "Doe",
    };

    const output = keysToCamelCase(input);

    expect(output).toEqual({
      firstName: "John",
      lastName: "Doe",
    });
  });

  it("should convert nested keys to camelCase", () => {
    const input = {
      user_id: 123,
      user_details: {
        first_name: "John",
        last_name: "Doe",
        email_address: "john.doe@example.com",
      },
    };

    const output = keysToCamelCase(input);

    expect(output).toEqual({
      userId: 123,
      userDetails: {
        firstName: "John",
        lastName: "Doe",
        emailAddress: "john.doe@example.com",
      },
    });
  });

  it("should convert array of objects keys to camelCase", () => {
    const input = [
      {
        user_id: 123,
        user_name: "JohnDoe",
        user_details: {
          first_name: "John",
          last_name: "Doe",
        },
      },
      {
        user_id: 456,
        user_name: "JaneDoe",
        user_details: {
          first_name: "Jane",
          last_name: "Doe",
        },
      },
    ];

    const output = keysToCamelCase(input);

    expect(output).toEqual([
      {
        userId: 123,
        userName: "JohnDoe",
        userDetails: {
          firstName: "John",
          lastName: "Doe",
        },
      },
      {
        userId: 456,
        userName: "JaneDoe",
        userDetails: {
          firstName: "Jane",
          lastName: "Doe",
        },
      },
    ]);
  });
});
