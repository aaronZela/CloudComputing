import { formatDate } from '../../utils/formatters';

function CommentsList({ comments = [] }) {
  if (comments.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No hay comentarios aún
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {comments.map((comment, index) => (
        <div key={index} className="bg-gray-50 rounded-lg p-4">
          <div className="flex justify-between items-start mb-2">
            <span className="font-medium text-gray-900">
              {comment.usuario_nombre}
            </span>
            <span className="text-sm text-gray-500">
              {formatDate(comment.creado_en)}
            </span>
          </div>
          <p className="text-gray-700">{comment.texto}</p>
        </div>
      ))}
    </div>
  );
}

export default CommentsList;