using System.Diagnostics;
using System.Runtime.InteropServices;
using System.Windows.Forms;

namespace PongTest
{
    public partial class Form1 : Form
    {
        Ball ball = new(10, 10, 0, 0, 20);
        Wall wall = new(100, 100, 20, 20, Color.Red);
        List<IObject> objects = new();
        public Form1()
        {
            InitializeComponent();
            timer1.Start();
            ball.Color = Color.Blue;
            ball.Speed = 3;
            objects.Add(wall);
        }


        //private void panel1_Paint(object sender, PaintEventArgs e)
        //{
        //    Graphics g = e.Graphics;
        //    Pen selPen = new Pen(Color.Blue);
        //    Brush selBrush = new SolidBrush(Color.Blue);
        //    //    g.DrawLine(System.Drawing.Pens.Red, panel1.Left, panel1.Top,
        //    //panel1.Right, panel1.Bottom);
        //    // g.DrawRectangle(selPen, 5, 5, 20, 20);
        //    //g.DrawEllipse(selPen, ball.x, ball.y, ball.size, ball.size);
        //    g.FillEllipse(selBrush, ball.X, ball.Y, ball.Size, ball.Size);
            
        //}

        Stopwatch stopwatch = new();
        private void timer1_Tick(object sender, EventArgs e)
        {
            stopwatch.Restart();
            Size panelSize = pictureBox1.ClientSize;
            double elapsedSec = (double)stopwatch.ElapsedTicks / Stopwatch.Frequency;
            int newX = ball.X + ball.Dx;
            int newY = ball.Y + ball.Dy;
            label1.Text = wall.Distance(ball).ToString();
            bool collision = false;
            foreach (StaticObject obj in objects)
            {
                if (obj.Distance(ball) < 300){
                    collision = collision || ball.DetectCollision(obj);
                    if (ball.DetectCollision(obj))
                    {
                        if (obj is HiddenWall)
                        {
                            obj.Reveal();
                        }
                        break;
                    }
                }
            }
            if (ball.X + ball.Width > panelSize.Width)
            {
                ball.X = panelSize.Width - ball.Width;
            }

            if (ball.Y + ball.Height > panelSize.Height)
            {
                ball.Y = panelSize.Height - ball.Height;
            }

            if (ball.Y < 0)
            {
                ball.Y = 0;
            }

            if (ball.X < 0)
            {
                ball.X = 0;
            }

            if (!collision)
            {
                ball.X += ball.Dx;
                ball.Y += ball.Dy;
            }
            else
            {
                ball.resetMovement();
                //MessageBox.Show("assda");
            }
            //Bouncing
            //if (ball.x > panelSize.Width - 20 || ball.x < 0)
            //{
            //    ball.dx *= -1;
            //}
            //if (ball.y > panelSize.Height - 20 || ball.y < 0)
            //{
            //    ball.dy *= -1;
            //}


            //label1.Text =$"Starfield in Windows Forms - {elapsedSec * 1000:0.00} ms ({1 / elapsedSec:0.00} FPS)";
            pictureBox1.Refresh();
        }

        private void pictureBox1_Paint(object sender, PaintEventArgs e)
        {
            Graphics g = e.Graphics;
            Pen selPen = new Pen(Color.Blue);
            //Brush selBrush = new SolidBrush(Color.Blue);
            //    g.DrawLine(System.Drawing.Pens.Red, panel1.Left, panel1.Top,
            //panel1.Right, panel1.Bottom);
            // g.DrawRectangle(selPen, 5, 5, 20, 20);
            g.DrawEllipse(selPen, ball.X, ball.Y, ball.Size, ball.Size);
            foreach (var obj in objects)
            {
                g.FillRectangle(new SolidBrush(obj.Color), obj.X, obj.Y, obj.Width, obj.Height);
            }
            
        }

        private void Form1_KeyDown(object sender, KeyEventArgs e)
        {

        }

        private void Form1_KeyUp(object sender, KeyEventArgs e)
        {
            if (e.KeyCode == Keys.W)
            {
                ball.Dy = 0;
            }
            if (e.KeyCode == Keys.S)
            {
                ball.Dy = 0;
            }
            if (e.KeyCode == Keys.A)
            {
                ball.Dx = 0;
            }
            if (e.KeyCode == Keys.D)
            {
                ball.Dx = 0;
            }
        }

        private void Form1_KeyPress(object sender, KeyPressEventArgs e)
        {
            if (e.KeyChar == 'w')
            {
                //ball.resetMovement();
                ball.MoveUP();
            }
            if (e.KeyChar == 's')
            {
                //ball.resetMovement();
                ball.MoveDown();
            }
            if (e.KeyChar == 'a')
            {
                //ball.resetMovement();
                ball.MoveLeft();
            }
            if (e.KeyChar == 'd')
            {
             //ddd   ball.resetMovement();
                ball.MoveRight();
            }
        }

        private void button1_Click(object sender, EventArgs e)
        {
            Random random = new Random();
            int y = random.Next(0, pictureBox1.ClientSize.Width);
            int x = random.Next(0, pictureBox1.ClientSize.Height);
            objects.Add(new HiddenWall(x, y, 150, 30, Color.Red, Color.Blue));
        }
    }
}