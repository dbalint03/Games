using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PongTest
{
    public interface IObject
    {
        public int X { get; set; }
        public int Y { get; set; }
        public int Width { get; set; }
        public int Height { get; set; }
        public Color Color { get; set; }

        public double Distance(IObject obj);
    }
    abstract class MovableObject : IObject
    {
        public int X { get; set; }
        public int Y { get; set; }
        public int Dx { get; set; }
        public int Dy { get; set; }
        public int Width { get; set; }
        public int Height { get; set; }
        public Color Color { get; set; }

        public MovableObject(int x, int y, int dx, int dy, int width, int height)
        {
            this.X = x;
            this.Y = y;
            this.Dx = dx;
            this.Dy = dy;
            this.Width = width;
            this.Height = height;
        }

        public MovableObject(int x, int y, int dx, int dy, int size)
        {
            this.X = x;
            this.Y = y;
            this.Dx = dx;
            this.Dy = dy;
            this.Width = size;
            this.Height = size;
        }

        public double Distance(IObject obj)
        {
            throw new NotImplementedException();
        }
    }

    abstract class StaticObject : IObject
    {
        public int X { get; set; }
        public int Y { get; set; }

        public int Width { get; set; }
        public int Height { get; set; }
        public Color Color { get; set; }
        public StaticObject(int x, int y, int width, int height)
        {
            X = x;
            Y = y;
            Width = width;
            Height = height;
        }

        public StaticObject(int x, int y, int width, int height, Color color)
        {
            X = x;
            Y = y;
            Width = width;
            Height = height;
            Color = color;
        }

        public double Distance(IObject obj)
        {
            return Math.Sqrt((X - obj.X) * (X - obj.X) + (Y - obj.Y) * (Y - obj.Y));
        }

        public virtual void Reveal()
        {

        }
    }

    internal class Wall : StaticObject
    {
        public Wall(int x, int y, int width, int height, Color color) : base(x, y, width, height, color)
        {

        }
    }

    internal class HiddenWall : Wall
    {

        private Color NewColor { get; set; }
        public HiddenWall(int x, int y, int width, int height, Color color, Color revealaedColor) : base(x, y, width, height, color)
        {
            NewColor = revealaedColor;
        }

        public override void Reveal()
        {
            Color = NewColor;
        }
    }
}
