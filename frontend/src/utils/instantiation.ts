import { tags } from "../schema/Tag.schema";

const initializeTags = () => {
  const storedTags = localStorage.getItem('tags');
  const storedPomoTimer = localStorage.getItem("hiddenPomoTimer")

  if (!storedTags) {
    localStorage.setItem('tags', JSON.stringify(tags));
  }

  if(!storedPomoTimer){
    localStorage.setItem("hiddenPomoTimer", JSON.stringify(true))
  }
};

export default initializeTags;
