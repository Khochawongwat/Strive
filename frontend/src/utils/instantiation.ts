import { tags } from "../schema/Tag.schema";

const initializeTags = () => {
  const storedTags = localStorage.getItem('tags');

  if (!storedTags) {
    localStorage.setItem('tags', JSON.stringify(tags));
  }
};

export default initializeTags;
