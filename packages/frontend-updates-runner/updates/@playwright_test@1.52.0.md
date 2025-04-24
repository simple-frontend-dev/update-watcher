# Playwright v1.52.0

The highlights are:

- New method expect(locator).toContainClass() to ergonomically assert individual class names on the element.

```javascript
await expect(page.getByRole("listitem", { name: "Ship v1.52" })).toContainClass(
  "done",
);
```

- Aria Snapshots got two new properties: /children for strict matching and /url for links, yay for accessibility!

```javascript
await expect(locator).toMatchAriaSnapshot(`
  - list
    - /children: equal
    - listitem: Feature A
    - listitem:
      - link "Feature B":
        - /url: "https://playwright.dev"
`);
```

[Full release notes](https://github.com/microsoft/playwright/releases/tag/v1.52.0)
