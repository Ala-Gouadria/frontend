import './QualityBlocks.css'

function classNames(...values) {
  return values.filter(Boolean).join(' ')
}

export function QualityBlocks({
  blocks = [
    { tone: 'green', count: 14 },
    { tone: 'orange', count: 4 },
    { tone: 'red', count: 3 },
  ],
  className = '',
}) {
  return (
    <div className={classNames('quality-blocks', className)}>
      {blocks.flatMap((group) =>
        Array.from({ length: group.count }).map((_, index) => (
          <span
            key={`${group.tone}-${index}`}
            className={classNames('quality-blocks__block', `quality-blocks__block--${group.tone ?? 'green'}`)}
            style={{ '--block-index': index }}
            title={`${group.tone ?? 'green'} block ${index + 1} of ${group.count}`}
          />
        )),
      )}
    </div>
  )
}

export default QualityBlocks
