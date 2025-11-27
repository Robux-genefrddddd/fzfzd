interface MessageRendererProps {
  content: string;
  role: "user" | "assistant";
  isStreaming?: boolean;
}

export function MessageRenderer({
  content,
  role,
  isStreaming = false,
}: MessageRendererProps) {
  // Check if content is an image URL
  const imageUrlPattern = /^https?:\/\/[^\s]+\.(jpg|jpeg|png|gif|webp|svg)$/i;
  const isImageUrl = imageUrlPattern.test(content.trim());

  if (isImageUrl) {
    return (
      <div className="flex justify-center">
        <div className="rounded-3xl overflow-hidden border-2 border-white/20 shadow-lg max-w-xs">
          <img
            src={content}
            alt="Message content"
            className="w-full h-auto object-cover"
          />
        </div>
      </div>
    );
  }

  // Check if content contains code blocks (```code```)
  const hasCodeBlock = /```[\s\S]*?```/.test(content);
  const isCodeBlock = content.trim().startsWith("```") && content.trim().endsWith("```");

  if (isCodeBlock || hasCodeBlock) {
    // Handle code blocks
    const codeBlockRegex = /```(\w*)\n?([\s\S]*?)```/g;
    const parts: (string | React.ReactNode)[] = [];
    let lastIndex = 0;
    let match;

    while ((match = codeBlockRegex.exec(content)) !== null) {
      // Add text before code block
      if (match.index > lastIndex) {
        const textBefore = content.substring(lastIndex, match.index).trim();
        if (textBefore) {
          parts.push(
            <p key={`text-${lastIndex}`} className="mb-2 leading-relaxed">
              {textBefore}
            </p>
          );
        }
      }

      const lang = match[1] || "";
      const code = match[2].trim();

      parts.push(
        <div
          key={`code-${match.index}`}
          className="my-3 rounded-lg overflow-hidden bg-white/5 border border-white/10"
        >
          {lang && (
            <div className="bg-white/5 px-4 py-2 text-xs font-mono text-white/60 border-b border-white/10">
              {lang}
            </div>
          )}
          <pre className="p-4 overflow-x-auto">
            <code className="font-mono text-sm leading-relaxed text-white/90">
              {code}
            </code>
          </pre>
        </div>
      );

      lastIndex = match.index + match[0].length;
    }

    // Add remaining text
    if (lastIndex < content.length) {
      const remaining = content.substring(lastIndex).trim();
      if (remaining) {
        parts.push(
          <p key={`text-end`} className="mb-2 leading-relaxed">
            {remaining}
          </p>
        );
      }
    }

    return (
      <div className="text-white/90 space-y-2">
        {parts}
        {isStreaming && (
          <span className="inline-block w-2 h-5 bg-white/50 ml-1 animate-pulse" />
        )}
      </div>
    );
  }

  // Plain text rendering
  return (
    <div className="text-white/90 leading-relaxed whitespace-pre-wrap break-words">
      {content}
      {isStreaming && (
        <span className="inline-block w-2 h-5 bg-white/50 ml-1 animate-pulse" />
      )}
    </div>
  );
}
