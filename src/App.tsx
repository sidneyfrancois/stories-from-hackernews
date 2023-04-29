import * as React from "react";
import "./App.css";
import { useCallback, useMemo, useReducer, useState } from "react";
import axios from "axios";
import SearchForm from "./Components/SearchForm";
import { List } from "./Components/List";
import { useStorageState } from "./Hooks/useStorageState";
import { storiesReducer } from "./Reducers/storiesReducer";

const API_ENDPOINT = "https://hn.algolia.com/api/v1/search?query=";

type Story = {
  objectID: string;
  url: string;
  title: string;
  author: string;
  num_comments: string;
  points: number;
};

const getSumComments = (stories: any) => {
  return stories.data.reduce(
    (result: any, value: any) => result + value.num_comments,
    0
  );
};

function App() {
  const [searchTerm, setSearchTerm] = useStorageState("search", "");
  const [url, setUrl] = useState(`${API_ENDPOINT}${searchTerm}`);

  const handleFetchStories = useCallback(async () => {
    if (!searchTerm) return;

    dispatchStories({ type: "STORIES_FETCH_INIT" });

    try {
      const result = await axios.get(url);

      dispatchStories({
        type: "STORIES_FETCH_SUCCESS",
        payload: result.data.hits,
      });
    } catch {
      dispatchStories({ type: "STORIES_FETCH_FAILURE" });
    }
  }, [url]);

  React.useEffect(() => {
    handleFetchStories();
  }, [handleFetchStories]);

  const [stories, dispatchStories] = useReducer(storiesReducer, {
    data: [],
    isLoading: false,
    isError: false,
  });

  const handleRemoveStory = useCallback((item: Story) => {
    dispatchStories({
      type: "REMOVE_STORY",
      payload: item,
    });
  }, []);

  React.useEffect(() => {
    localStorage.setItem("search", searchTerm);
  }, [searchTerm]);

  const handleSearchInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    setUrl(`${API_ENDPOINT}${searchTerm}`);
    event.preventDefault();
  };

  const sumComments = useMemo(() => getSumComments(stories), [stories]);

  return (
    <>
      <h1>My Hacker Stories</h1>
      <h2>My Hacker Stories with {sumComments} comments.</h2>

      <SearchForm
        searchTerm={searchTerm}
        onSearchInput={handleSearchInput}
        onSearchSubmit={handleSearchSubmit}
      />

      <hr />

      {stories.isError && <p>Something went wrong...</p>}

      {stories.isLoading ? (
        <p>Loading...</p>
      ) : (
        <List list={stories.data} onRemoveItem={handleRemoveStory} />
      )}
    </>
  );
}

export default App;
