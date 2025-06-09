import { useDisclosure } from "@chakra-ui/react";
import { createContext, useContext } from "react";

const TabsMenuContext = createContext();

export const TabsMenuExpandProvider = ({ children }) => {
  const { onOpen, onClose, isOpen, onToggle } = useDisclosure({
    defaultIsOpen: true,
  });
  return (
    <TabsMenuContext.Provider value={{ onOpen, onClose, isOpen, onToggle }}>
      {children}
    </TabsMenuContext.Provider>
  );
};
export const useTabsMenuStatus = () => {
  return useContext(TabsMenuContext);
};
