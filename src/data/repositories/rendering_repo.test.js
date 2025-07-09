import test, { describe } from "node:test";
import RenderingRepo from "./rendering_repo.js";
import FileSystemIo from "../sources/file_system_io.js";
import HtmlRenderer from "../sources/html_renderer.js";
import Component from "../../domain/entities/component.js";
import assert from "node:assert";

describe(RenderingRepo.name, () => {
  const file_system_io_library = new FileSystemIo();
  const html_renderer_library = new HtmlRenderer();
  const rendering_repo = new RenderingRepo({
    file_system_io_library,
    html_renderer_library,
  });

  describe(rendering_repo.renderComponent.name, () => {
    test("renders component to string", async () => {
      const component = new Component({
        name: "layout",
        placeholders: {
          title: "title text",
          body: "body text",
        },
      });

      const rendered_component = await rendering_repo.renderComponent(component);

      assert.strictEqual(typeof rendered_component, "string");
    });

    test("renders nested components", async () => {
      const nested_component = new Component({
        name: "layout",
        placeholders: {
          title: "nested title text",
          body: "nested body text",
        },
      });

      const component = new Component({
        name: "layout",
        placeholders: {
          title: "original title text",
          body: nested_component,
        },
      });

      const rendered_component = await rendering_repo.renderComponent(component);
      console.log(rendered_component);

      assert.strictEqual(rendered_component.includes("[object Object]"), false, `Did not render [object Object]: [${rendered_component}].`);
      assert.strictEqual(rendered_component.includes("nested body text"), true, `Did not include [nested body text]: [${rendered_component}].`);
      assert.strictEqual(rendered_component.includes("original title text"), true, `Did not include [nested body text]: [${rendered_component}].`);
    });
  });
});
