import { useFetch } from "../../../../../../../Hooks/useFetch/useFetch";
import { Select, Skeleton, Text } from "@chakra-ui/react";
import { InputElement } from "../../../../../../../Components/Common/Index";
import { FaPuzzlePiece } from "react-icons/fa";

export const Category = ({ register, errors }) => {
  const { data: Categories, loading: CatogiriesLoading } = useFetch({
    endpoint: "categories",
  });
  const { data: SubCategories, loading: SubCatogiriesLoading } = useFetch({
    endpoint: "sub-categories",
  });
  return (
    <>
      <Text>Please Choose The Category</Text>
      <Skeleton minH="50px" isLoaded={!CatogiriesLoading}>
        <InputElement
          register={register}
          name="category"
          as={Select}
          Icon={FaPuzzlePiece}
          placeholder="Category"
          size="lg"
          errors={errors}
        >
          {Categories?.map((category) => {
            return (
              <option value={category.id} key={category.id}>
                {category.title}
              </option>
            );
          })}
        </InputElement>
      </Skeleton>
      <Skeleton minH="50px" isLoaded={!SubCatogiriesLoading}>
        <InputElement
          register={register}
          name="subCategory"
          as={Select}
          Icon={FaPuzzlePiece}
          placeholder="sub category"
          size="lg"
          errors={errors}
        >
          {SubCategories?.map((category) => {
            return (
              <option value={category.id} key={category.id}>
                {category.title}
              </option>
            );
          })}
        </InputElement>
      </Skeleton>
    </>
  );
};
