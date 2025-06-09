import React from "react";
import { LazyLoadedImage } from "../LazyLoadedImage/LazyLoadedImage";
import LogoImage from "../../../assets/Logo/Image.png";
export const Logo = ({ ...rest }) => {
  return <LazyLoadedImage w="80px" {...rest} src={LogoImage} />;
};
