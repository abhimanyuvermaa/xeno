export default function PageHeader({ title, description, action }) {
    return (
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-bold">{title}</h1>
          {description && (
            <p className="text-gray-500 mt-1">{description}</p>
          )}
        </div>
        {action && (
          <div>{action}</div>
        )}
      </div>
    )
  }