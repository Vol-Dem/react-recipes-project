declare module "*.svg?react" {
  import type { ComponentType, SVGProps } from "react";

  const SvgComponent: ComponentType<SVGProps<SVGSVGElement>>;

  export default SvgComponent;
}
