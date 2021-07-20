import fc from 'fast-check';
import { validParentheses } from './009-validParentheses';

type WellParenthesed = { type: '(' | '[' | '{'; content: WellParenthesed[] };
const wellParenthesedStringArbitrary = fc
  .array(
    fc.letrec((tie) => ({
      parenthesed: fc.record<WellParenthesed>({
        type: fc.constantFrom('(', '[', '{'),
        // We use a oneof instead of a raw array to enforce the convergence towards a finite structure
        content: fc.oneof(
          { depthFactor: 1 },
          fc.constant([]),
          fc.array(tie('parenthesed') as fc.Arbitrary<WellParenthesed>)
        ),
      }),
    })).parenthesed
  )
  .map((definition) => {
    function toString(subDefinition: WellParenthesed) {
      const matching = subDefinition.type === '(' ? ')' : subDefinition.type === '[' ? ']' : '}';
      return `${subDefinition.type}${subDefinition.content.map((p) => toString(p)).join('')}${matching}`;
    }
    return definition.map((p) => toString(p)).join('');
  });

type ReversedParenthesed = { type: '(' | '[' | '{'; content: ReversedParenthesed[]; reversed: boolean };
const reversedParenthesedStringArbitrary = fc
  .array(
    fc.letrec((tie) => ({
      parenthesed: fc.record<ReversedParenthesed>({
        reversed: fc.boolean(),
        type: fc.constantFrom('(', '[', '{'),
        // We use a oneof instead of a raw array to enforce the convergence towards a finite structure
        content: fc.oneof(
          { depthFactor: 1 },
          fc.constant([]),
          fc.array(tie('parenthesed') as fc.Arbitrary<ReversedParenthesed>)
        ),
      }),
    })).parenthesed
  )
  .filter((definition) => {
    function hasReversed(subDefinition: ReversedParenthesed) {
      if (subDefinition.reversed) return true;
      return subDefinition.content.some((p) => subDefinition.type !== p.type && hasReversed(p));
    }
    return definition.some((p) => hasReversed(p));
  })
  .map((definition) => {
    function toString(subDefinition: ReversedParenthesed) {
      const matching = subDefinition.type === '(' ? ')' : subDefinition.type === '[' ? ']' : '}';
      const start = subDefinition.reversed ? matching : subDefinition.type;
      const end = subDefinition.reversed ? subDefinition.type : matching;
      return `${start}${subDefinition.content.map((p) => toString(p)).join('')}${end}`;
    }
    return definition.map((p) => toString(p)).join('');
  });

type NonMatchingEndParenthesed = { start: '(' | '[' | '{'; end: ')' | ']' | '}'; content: NonMatchingEndParenthesed[] };
const nonMatchingEndParenthesedStringArbitrary = fc
  .array(
    fc.letrec((tie) => ({
      parenthesed: fc.record<NonMatchingEndParenthesed>({
        start: fc.constantFrom('(', '[', '{'),
        end: fc.constantFrom(')', ']', '}'),
        // We use a oneof instead of a raw array to enforce the convergence towards a finite structure
        content: fc.oneof(
          { depthFactor: 1 },
          fc.constant([]),
          fc.array(tie('parenthesed') as fc.Arbitrary<NonMatchingEndParenthesed>)
        ),
      }),
    })).parenthesed
  )
  .filter((definition) => {
    function hasNonMatchingEnd(subDefinition: NonMatchingEndParenthesed) {
      const matchingEnd = subDefinition.start === '(' ? ')' : subDefinition.start === '[' ? ']' : '}';
      if (subDefinition.end !== matchingEnd) return true;
      if (subDefinition.content.length !== 1) return subDefinition.content.some((p) => hasNonMatchingEnd(p));
      return false; // We still reject too many things
    }
    return definition.some((p) => hasNonMatchingEnd(p));
  })
  .map((definition) => {
    function toString(subDefinition: NonMatchingEndParenthesed) {
      return `${subDefinition.start}${subDefinition.content.map((p) => toString(p)).join('')}${subDefinition.end}`;
    }
    return definition.map((p) => toString(p)).join('');
  });

describe('009-validParentheses', () => {
  it('should accept any well-parenthesed expression', () => {
    fc.assert(
      fc.property(wellParenthesedStringArbitrary, (expression) => {
        expect(validParentheses(expression)).toBe(true);
      })
    );
  });

  it('should reject any expression not containing an even number of signs', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.tuple(fc.constantFrom('(', '[', '{', ')', ']', '}'), fc.constantFrom('(', '[', '{', ')', ']', '}'))
        ),
        fc.constantFrom('(', '[', '{', ')', ']', '}'),
        (evenNumParentheses, extraParenthesis) => {
          const invalidExpression = [...evenNumParentheses.flat(), extraParenthesis].join('');
          expect(validParentheses(invalidExpression)).toBe(false);
        }
      )
    );
  });

  it('should reject any expression not having the same number of openings and closings', () => {
    fc.assert(
      fc.property(
        wellParenthesedStringArbitrary,
        fc.constantFrom('(', '[', '{', ')', ']', '}'),
        fc.nat().noShrink(),
        (expression, extra, seed) => {
          const position = seed % (expression.length + 1);
          const invalidExpression = expression.substring(0, position) + extra + expression.substring(position);
          expect(validParentheses(invalidExpression)).toBe(false);
        }
      )
    );
  });

  it('should reject any expression with at least one reversed openings and closings', () => {
    fc.assert(
      fc.property(reversedParenthesedStringArbitrary, (expression) => {
        expect(validParentheses(expression)).toBe(false);
      })
    );
  });

  it('should reject any expression with non-matching openings and closings', () => {
    fc.assert(
      fc.property(nonMatchingEndParenthesedStringArbitrary, (expression) => {
        expect(validParentheses(expression)).toBe(false);
      })
    );
  });
});
