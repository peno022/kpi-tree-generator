/**
 * @jest-environment node
 */

import keysToSnakeCase from "../../app/javascript/keys_to_snake_case";

describe("keysToSnakeCase", () => {
  it("should convert top level keys to snake_case", () => {
    const input = {
      firstName: "John",
      lastName: "Doe",
    };

    const output = keysToSnakeCase(input);

    expect(output).toEqual({
      first_name: "John",
      last_name: "Doe",
    });
  });

  it("should convert nested keys to snake_case", () => {
    const input = {
      userId: 123,
      userDetails: {
        firstName: "John",
        lastName: "Doe",
        emailAddress: "john.doe@example.com",
      },
    };

    const output = keysToSnakeCase(input);

    expect(output).toEqual({
      user_id: 123,
      user_details: {
        first_name: "John",
        last_name: "Doe",
        email_address: "john.doe@example.com",
      },
    });
  });

  it("should convert array of objects keys to snake_case", () => {
    const input = [
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
    ];

    const output = keysToSnakeCase(input);

    expect(output).toEqual([
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
    ]);
  });
});
