using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PongTest
{
    internal class Ball : MovableObject
    {
        public int Size { get; set; }
        public int Speed { get; set; }
        public Ball(int x, int y, int dx, int dy, int size) : base(x,y,dx,dy, size)
        {
            this.Size = size;
        }

        internal void resetMovement()
        {
            this.Dx = 0;
            this.Dy = 0;
        }

        internal bool DetectCollision(IObject obj)
        {
            if (X + Dx < obj.X + obj.Width &&
                    X + Dx + Width > obj.X &&
                    Y + Dy < obj.Y + obj.Height &&
                    Y + Dy + Height > obj.Y)
            {
                return true;
            }
            return false;

        }

        internal void MoveUP()
        {
            Dy = -Speed;
        }

        internal void MoveDown()
        {
            Dy = Speed;
        }

        internal void MoveLeft()
        {
            Dx = -Speed;
        }

        internal void MoveRight()
        {
            Dx = Speed;
        }
    }
}
