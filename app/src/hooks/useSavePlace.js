import { useState } from 'react';

export default function useSavePlace() {
  

  const [savedPlanPages, setSavedPlanPages] = useState(getUser());

  


  return {
    setSavedPlanPages: saveUser,
    savedPlanPages
  };
}
