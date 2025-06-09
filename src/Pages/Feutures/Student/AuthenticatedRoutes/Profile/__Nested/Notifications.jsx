import React from "react";
import { Box, VStack, HStack, Text, Avatar, Container } from "@chakra-ui/react";
import { FaUsers } from "react-icons/fa";
const userData = [
  {
    id: 1,
    name: "Corey George",
    text: "Architecto sequi pariatur vitae repellat quos accusantium error aut aut. Sed atque eos ut expedita earum et sunt dolorem. Dolor sed labore molestiae labore accusantium.",
    avatarUrl: "/api/placeholder/40/40",
  },
  {
    id: 2,
    name: "Jim Spencer MD",
    text: "Dolorum deleniti error beatae enim deleniti ex quis. Dignissimos perspiciatis magnam sequi quia soluta. Autem nemo voluptatibus dicta soluta reprehenderit enim esse. Similique assumenda ut maxime est quae cum. Vel et porro deleniti saepe.",
    avatarUrl: "/api/placeholder/40/40",
  },
  {
    id: 3,
    name: "Donnie Wiza",
    text: "Qui maiores aspernatur rerum consectetur est. Et delectus et laudantium dolorum vero tenetur rem pariatur. Esse optio nihil unde sed ex.",
    avatarUrl: "/api/placeholder/40/40",
  },
  {
    id: 4,
    name: "Olive Reynolds",
    text: "Ipsum porro cumque quia rerum velit atque quae sed. Optio sint et saepe dolor. Omnis voluptas animi architecto hic eius nobis culpa. Et quaerat asperiores.",
    avatarUrl: "/api/placeholder/40/40",
  },
  {
    id: 5,
    name: "Alonzo Willms",
    text: "Praesentium omnis perferendis non. Aliquam omnis sequi aut molestiae. Reiciendis dolor quos exercitationem possimus illo voluptatem accusamus dolore. Sit et dicta numquam reprehenderit nulla fugit quisquam quisquam. Quo omnis fugiat consequatur. Qui dolore aut harum at laborum magnam quisquam nam.",
    avatarUrl: "/api/placeholder/40/40",
  },
  {
    id: 6,
    name: "Susan Wuckert",
    text: "Recusandae quos omnis neque sequi. Eveniet ipsa suscipit voluptatibus autem perferendis. Qui aut voluptates voluptate sed quo id at. Illum sit adipisci eligendi commodi reprehenderit blanditiis est corrupti. Aut ducimus eum aut vel reiciendis inventore suscipit saepe. Et placeat laborum et et magnam labore necessitatibus minima hic.",
    avatarUrl: "/api/placeholder/40/40",
  },
];

export default function Index() {
  return (
    <Container maxW="4xl" py={8}>
      <VStack spacing={4} w="full">
        {userData.map((user) => (
          <Box
            key={user.id}
            w="full"
            p={4}
            borderWidth="1px"
            borderRadius="lg"
            _hover={{ shadow: "md" }}
            transition="all 0.2s"
            bg="white"
          >
            <HStack spacing={4} align="start">
              <Avatar size="md" name={user.name} src={user.avatarUrl} />
              <Box>
                <HStack spacing={2} mb={2}>
                  <Text fontWeight="bold">{user.name}</Text>
                  {user.name.includes("MD") && (
                    <FaUsers className="h-4 w-4 text-blue-500" />
                  )}
                </HStack>
                <Text color="gray.600" fontSize="sm">
                  {user.text}
                </Text>
              </Box>
            </HStack>
          </Box>
        ))}
      </VStack>
    </Container>
  );
}
