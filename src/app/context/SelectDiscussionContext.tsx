// import React, { createContext, useContext, useState } from 'react';
// import { DiscussionDto } from '../interfaces/DiscussionPanel';

// export interface SelectedDiscussionContextType {
//   selectedDiscussion: DiscussionDto;
//   setSelectedDiscussion: React.Dispatch<React.SetStateAction<DiscussionDto> >;
// }

// const SelectedDiscussionContext = createContext<SelectedDiscussionContextType | undefined>(undefined);

// export function SelectedDiscussionProvider({ children }: { children: React.ReactNode }) {
//   const [selectedDiscussion, setSelectedDiscussion] = useState<DiscussionDto>({
//     id: '',
//     user_id: '',
//     username: '',
//     avatar: '',
//   });

//   const contextValue: SelectedDiscussionContextType = {
//     selectedDiscussion,
//     setSelectedDiscussion,
//   };

//   return (
//     <SelectedDiscussionContext.Provider value={contextValue}>
//       {children}
//     </SelectedDiscussionContext.Provider>
//   );
// }

// export function useSelectDiscussion () 
// {
//   return useContext(SelectedDiscussionContext) as SelectedDiscussionContextType;
// }