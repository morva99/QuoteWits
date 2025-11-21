import MyCollection from '../components/MyCollection';

function CollectionPage({ savedItems, onRemoveFromFavorites }) {
  return (
    <MyCollection
      savedItems={savedItems}
      onRemoveFromFavorites={onRemoveFromFavorites}
    />
  );
}

export default CollectionPage;

