function CollectionsTab({ data }) {
  const collections = data.collections;

  if (!collections?.length)
    return <div className="text-gray-500">No collections found.</div>;

  return <div>Collection table UI here…</div>;
}
