import { memo } from "react";

type Story = {
  objectID: string;
  url: string;
  title: string;
  author: string;
  num_comments: string;
  points: number;
};

type ItemProps = {
  item: Story;
  onRemoveItem: (item: Story) => void;
};

type Stories = Story[];
type ListProps = {
  list: Stories;
  onRemoveItem: (item: Story) => void;
};

const List = memo(({ list, onRemoveItem }: ListProps) => (
  <ul>
    {list.map((item: any) => {
      return (
        <>
          <Item key={item.objectID} item={item} onRemoveItem={onRemoveItem} />
        </>
      );
    })}
  </ul>
));

const Item: React.FC<ItemProps> = ({ item, onRemoveItem }): JSX.Element => (
  <li key={item.objectID}>
    <span>
      <a href={item.url}>{item.title}</a>
    </span>
    <span>{item.author}</span>
    <span>{item.num_comments}</span>
    <span>{item.points}</span>
    <span>
      {/* <button type="button" onClick={onRemoveItem.bind(null, item)}> */}
      <button type="button" onClick={() => onRemoveItem(item)}>
        Remove Item
      </button>
    </span>
  </li>
);

export { List };
