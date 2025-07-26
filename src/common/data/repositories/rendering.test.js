import test, { describe } from "node:test";
import RenderingRepo from "./rendering.js";
import FileSystemLib from "../sources/file_system_lib.js";
import HtmlRenderingLib from "../sources/html_rendering_lib.js";
import Component from "../../domain/entities/component.js";
import assert from "node:assert";

describe(RenderingRepo.name, () => {
  const file_system_io_library = new FileSystemLib();
  const html_renderer_library = new HtmlRenderingLib();
  const rendering_repo = new RenderingRepo({
    file_system_io_library,
    html_renderer_library,
    config: {
      components_dirs: [
        "src/common/presentation/components",
        "src/common/presentation/pages",
      ],
    }
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

      const rendered_component = await rendering_repo.renderComponent(
        component,
      );

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

      const nested_component_2 = new Component({
        name: "layout",
        placeholders: {
          title: "nested2 title text",
          body: "nested2 body text",
        },
      });

      const component = new Component({
        name: "layout",
        placeholders: {
          title: "original title text",
          body: nested_component,
          custom_footer: nested_component_2,
        },
      });

      const rendered_component = await rendering_repo.renderComponent(
        component,
      );

      assert.strictEqual(
        rendered_component.includes("[object Object]"),
        false,
        `Did not render [object Object]: [${rendered_component}].`,
      );
      assert.strictEqual(
        rendered_component.includes("nested body text"),
        true,
        `Did not include [nested body text]: [${rendered_component}].`,
      );
      assert.strictEqual(
        rendered_component.includes("nested2 body text"),
        true,
        `Did not include [nested2 body text]: [${rendered_component}].`,
      );
      assert.strictEqual(
        rendered_component.includes("original title text"),
        true,
        `Did not include [original title text]: [${rendered_component}].`,
      );
    });
  });
});
